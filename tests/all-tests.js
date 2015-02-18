/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require('infusion');
var gpii         = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests");

var path         = require("path");
var jqUnit       = fluid.require("jqUnit");
var request      = require("request");

require("../src/js/express");
require("../src/js/router");
require("../src/js/static");
require("../src/js/middleware");
require("../src/js/bodyparser");
require("../src/js/cookieparser");
require("../src/js/session");
require("./js/test-middleware");
require("./js/test-router");
require("./js/test-router-reqview");

gpii.express.tests.isSaneResponse = function(jqUnit, error, response, body) {
    jqUnit.assertNull("There should be no errors.", error);

    jqUnit.assertEquals("The response should have a reasonable status code", 200, response.statusCode);
    if (response.statusCode !== 200) {
        console.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertNotNull("There should be a body.", body);
};

var viewDir    = path.resolve(__dirname, "./views");
var contentDir = path.resolve(__dirname, "./html");

var express = gpii.express({
    "config": {
        "express": {
            "port" :   7531,
            "baseUrl": "http://localhost:7531/",
            "views":   viewDir,
            "session": {
                "secret": "Printer, printer take a hint-ter."
            }
        }
    },
    components: {
        "middleware": {
            "type": "gpii.express.tests.middleware.counter"
        },
        "bodyparser": {
            "type": "gpii.express.middleware.bodyparser"
        },
        "cookieparser": {
            "type": "gpii.express.middleware.cookieparser"
        },
        "session": {
            "type": "gpii.express.middleware.session"
        },
        "hello": {
            "type": "gpii.express.tests.router.hello",
            "options": {
                "components": {
                    "world": {
                        "type": "gpii.express.tests.router.hello",
                        "options": {
                            "path":    "/world",
                            "message": "Hello, yourself"
                        }
                    }
                }
            }
        },
        "wildcard": {
            "type": "gpii.express.tests.router.hello",
            "options": {
                "path":    "/wildcard/*",
                "message": "Hello, wild world."
            }
        },
        "static": {
            "type": "gpii.express.router.static",
            "options": {
                path:    "/",
                content: contentDir
            }
        },
        "reqview": {
            "type": "gpii.express.tests.router.reqview"
        }
    }
});

express.start(function(){
    jqUnit.module("Testing express module stack...");

    jqUnit.asyncTest("Testing the 'static' router module (index content)...", function() {
        var options = {
            url: express.options.config.express.baseUrl
        }
        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            var indexRegexp = /body of the index/;
            jqUnit.assertNotNull("The body should match the index content...", body.match(indexRegexp));
        });
    });

    jqUnit.asyncTest("Testing the 'static' router module (custom content)...", function() {
        var options = {
            url: express.options.config.express.baseUrl + "custom.html"
        };
        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            var customContentRegexp = /custom page/;
            jqUnit.assertNotNull("The body should match the custom content...", body.match(customContentRegexp));
        });
    });

    jqUnit.asyncTest("Testing the 'hello' router module...", function() {
        var options = {
            url: express.options.config.express.baseUrl + "hello"
        };
        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            jqUnit.assertEquals("The body should match the configured content...", express.hello.options.message, body);
        });
    });

    jqUnit.asyncTest("Testing a nested 'hello/world' router module...", function() {
        var options = {
            url: express.options.config.express.baseUrl + "hello/world"
        };
        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            jqUnit.assertEquals("The nested body should match the configured content...", express.hello.world.options.message, body);
        });
    });

    jqUnit.asyncTest("Testing a wildcard path (root)...", function() {
        var options = {
            url: express.options.config.express.baseUrl + "wildcard/"
        };
        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            jqUnit.assertEquals("The nested body should match the configured content...", express.wildcard.options.message, body);
        });
    });

    jqUnit.asyncTest("Testing a wildcard path (deep)...", function() {
        var options = {
            url: express.options.config.express.baseUrl + "wildcard/more/path/information"
        };
        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            jqUnit.assertEquals("The nested body should match the configured content...", express.wildcard.options.message, body);
        });
    });

    jqUnit.asyncTest("Testing the 'count' middleware to ensure it collects data...", function() {
        var originalValue = express.middleware.model.count;
        var options = {
            url: express.options.config.express.baseUrl
        };
        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            var newValue = express.middleware.model.count;
            jqUnit.assertTrue("The counter should go up each time we hit a page...", newValue > originalValue);
            jqUnit.assertEquals("The counter should only have been incremented by one...", 1, (newValue - originalValue));
        });
    });

    jqUnit.asyncTest("Test the 'cookie' middleware...", function(){
        var url    = express.options.config.express.baseUrl + "reqview";
        var j      = request.jar();
        var cookie = request.cookie('foo=bar');
        j.setCookie(cookie, url);

        var options = {
            url: url,
            jar: j
        };

        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            var data = JSON.parse(body);
            jqUnit.assertNotNull("There should be cookie data...", body.cookies);
            if (body.cookies) {
                jqUnit.assertNotNull("There should be a 'foo' cookie set...", body.cookies.foo);
            }
        });
    });

    jqUnit.asyncTest("Test the 'session' middleware...", function(){
        var url    = express.options.config.express.baseUrl + "reqview";

        var options = {
            url: url
        };

        request.get(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            var data = JSON.parse(body);
            jqUnit.assertNotNull("There should be session data...", body.session);
            if (body.session) {
                jqUnit.assertNotNull("There should be a 'lastAccess' session variable set...", body.session.lastAccess);
            }
        });
    });

    jqUnit.asyncTest("Test the 'body parser' middleware (json)...", function(){
        var options = {
            url:  express.options.config.express.baseUrl + "reqview",
            json: { "foo": "bar" }
        };

        request.post(options, function(error, response, body) {
            jqUnit.start();

            gpii.express.tests.isSaneResponse(jqUnit, error, response, body);

            jqUnit.assertNotNull("There should be body data...", body.body);
            if (body.body) {
                jqUnit.assertNotNull("There should be a 'foo' body params variable set...", body.body.foo);
            }
        });
    });

    jqUnit.asyncTest("Test stopping the server...", function(){
        express.stop(function(){
            var options = {
                url: express.options.config.express.baseUrl
            };

            request.get(options, function(error, response, body) {
                jqUnit.start();

                // The server should not have responded.
                jqUnit.assertNotNull("There should be an error returned.", error);
                jqUnit.assertEquals("The connection should have been refused.", "ECONNREFUSED", error.code);
            });
        });
    });

});

