"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

require("../lib/test-helpers");

fluid.registerNamespace("gpii.tests.express.middleware.caseHolder");

gpii.tests.express.middleware.caseHolder.verifyContent = function (response, body, expectedString) {

    gpii.tests.express.helpers.isSaneResponse(response, body);

    jqUnit.assertTrue("The body should match the custom content...", body.indexOf(expectedString !== -1));
};

gpii.tests.express.middleware.caseHolder.verifyMiddlewareIsolation = function (response, body) {

    gpii.tests.express.helpers.isSaneResponse(response, body);

    var data = JSON.parse(body);

    jqUnit.assertUndefined("The returned data should not contain session content from the sibling's middleware...", data.session);
    jqUnit.assertUndefined("The returned data should not contain cookie content from a child's middleware...", data.cookies);
};

// This test does not need to see the request per se, only the test environment after at least one request has gone through.
gpii.tests.express.middleware.caseHolder.testCounterMiddleware = function (that) {
    jqUnit.assertTrue("The counter should be greater than one...", that.express.counter.model.count > 1);
};

gpii.tests.express.middleware.caseHolder.testCookieMiddleware = function (response, body) {

    gpii.tests.express.helpers.isSaneResponse(response, body);

    jqUnit.assertNotNull("There should be cookie data...", body.cookies);
    if (body.cookies) {
        jqUnit.assertNotNull("There should be a 'foo' cookie set...", body.cookies.foo);
    }
};

gpii.tests.express.middleware.caseHolder.testSessionMiddleware = function (response, body) {

    gpii.tests.express.helpers.isSaneResponse(response, body);

    jqUnit.assertNotNull("There should be session data...", body.session);
    if (body.session) {
        jqUnit.assertNotNull("There should be a 'lastAccess' session variable set...", body.session.lastAccess);
    }
};

gpii.tests.express.middleware.caseHolder.testBodyParserMiddleware = function (response, body) {

    gpii.tests.express.helpers.isSaneResponse(response, body);

    jqUnit.assertNotNull("There should be body data...", body.body);
    if (body.body) {
        jqUnit.assertNotNull("There should be a 'foo' body params variable set...", body.body.foo);
    }
};

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.tests.express.middleware.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing middleware isolation...",
                    type: "test",
                    sequence: [
                        {
                            func: "{middlewareIsolationRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.middleware.caseHolder.verifyMiddlewareIsolation",
                            event: "{middlewareIsolationRequest}.events.onComplete",
                            args: ["{middlewareIsolationRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing the 'counter' middleware module...",
                    type: "test",
                    sequence: [
                        {
                            func: "{counterRequest}.send"
                        },
                        {
                            listener: "{counterSecondRequest}.send",
                            event: "{counterRequest}.events.onComplete"
                        },
                        {
                            listener: "gpii.tests.express.middleware.caseHolder.testCounterMiddleware",
                            event: "{counterSecondRequest}.events.onComplete",
                            args: ["{testEnvironment}"]
                        }
                    ]
                },
                {
                    name: "Testing the 'session' middleware module...",
                    type: "test",
                    sequence: [
                        {
                            func: "{sessionRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.middleware.caseHolder.testSessionMiddleware",
                            event: "{sessionRequest}.events.onComplete",
                            args: ["{sessionRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing the 'body parser' middleware module...",
                    type: "test",
                    sequence: [
                        {
                            func: "{bodyParserRequest}.send",
                            args: [{ foo: "bar" }]
                        },
                        {
                            listener: "gpii.tests.express.middleware.caseHolder.testBodyParserMiddleware",
                            event: "{bodyParserRequest}.events.onComplete",
                            args: ["{bodyParserRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing the 'cookie' middleware module...",
                    type: "test",
                    sequence: [
                        {
                            func: "{cookieSetRequest}.send"
                        },
                        {
                            listener: "{cookieReadRequest}.send",
                            event: "{cookieSetRequest}.events.onComplete"
                        },
                        {
                            listener: "gpii.tests.express.middleware.caseHolder.testCookieMiddleware",
                            event: "{cookieReadRequest}.events.onComplete",
                            args: ["{cookieReadRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        cookieJar: {
            type: "kettle.test.cookieJar"
        },
        counterRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "{testEnvironment}.options.baseUrl",
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        counterSecondRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "{testEnvironment}.options.baseUrl",
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        middlewareIsolationRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "hello/rv"
            }
        },
        cookieSetRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "cookie"
            }
        },
        cookieReadRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "reqview"
            }
        },
        sessionRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "reqview"
            }
        },
        bodyParserRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "reqview"
            }
        }
    }
});
