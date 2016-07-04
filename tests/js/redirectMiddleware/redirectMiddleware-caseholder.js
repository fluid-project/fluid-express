"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.express.redirectMiddleware");

gpii.tests.express.redirectMiddleware.checkInitialResponse = function (request, body) {
    jqUnit.assertEquals("The status code should be as expected...", 301, request.nativeResponse.statusCode);
    jqUnit.assertTrue("The body should indicate that we have been redirected...", body.indexOf("Moved Permanently") === 0);
};

gpii.tests.express.redirectMiddleware.launchSecondaryRequest = function (request, url) {
    request.options.path = url;
    request.send();
};

gpii.tests.express.redirectMiddleware.checkSecondaryResponse = function (request, body) {
    jqUnit.assertEquals("The status code should be as expected...", 200, request.nativeResponse.statusCode);
    jqUnit.assertTrue("The body should be as expected...", body.indexOf("Hello, World") === 0);
};

fluid.defaults("gpii.tests.express.redirectMiddleware.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing redirect middleware...",
            tests: [
                {
                    name: "A redirect should be performed as expected...",
                    type: "test",
                    sequence: [
                        {
                            func: "{originalRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.redirectMiddleware.checkInitialResponse",
                            event:    "{originalRequest}.events.onComplete",
                            args:    ["{originalRequest}", "{arguments}.0"]
                        },
                        {
                            funcName: "gpii.tests.express.redirectMiddleware.launchSecondaryRequest",
                            args:     ["{redirectRequest}", "{originalRequest}.nativeResponse.headers.location"]
                        },                        {
                            listener: "gpii.tests.express.redirectMiddleware.checkSecondaryResponse",
                            event:    "{redirectRequest}.events.onComplete",
                            args:    ["{redirectRequest}", "{arguments}.0"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        originalRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "redirectFrom"
            }
        },
        redirectRequest: {
            type: "gpii.test.express.request"
        }
    }
});
