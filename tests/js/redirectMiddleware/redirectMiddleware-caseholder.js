"use strict";
var fluid  = require("infusion");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("fluid.tests.express.redirectMiddleware");

fluid.tests.express.redirectMiddleware.checkInitialResponse = function (request, body) {
    jqUnit.assertEquals("The status code should be as expected...", 301, request.nativeResponse.statusCode);
    jqUnit.assertTrue("The body should indicate that we have been redirected...", body.indexOf("Moved Permanently") === 0);
};

fluid.tests.express.redirectMiddleware.launchSecondaryRequest = function (caseHolder, url) {
    caseHolder.events.redirectRequest.fire(url);
};

fluid.tests.express.redirectMiddleware.checkSecondaryResponse = function (request, body) {
    jqUnit.assertEquals("The status code should be as expected...", 200, request.nativeResponse.statusCode);
    jqUnit.assertTrue("The body should be as expected...", body.indexOf("Hello, World") === 0);
};

fluid.defaults("fluid.tests.express.redirectMiddleware.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
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
                            listener: "fluid.tests.express.redirectMiddleware.checkInitialResponse",
                            event:    "{originalRequest}.events.onComplete",
                            args:    ["{originalRequest}", "{arguments}.0"]
                        },
                        {
                            funcName: "fluid.tests.express.redirectMiddleware.launchSecondaryRequest",
                            args:     ["{caseHolder}", "{originalRequest}.nativeResponse.headers.location"]
                        },
                        {
                            listener: "fluid.tests.express.redirectMiddleware.checkSecondaryResponse",
                            event:    "{caseHolder redirectRequest}.events.onComplete",
                            args:    ["{redirectRequest}", "{arguments}.0"]
                        }
                    ]
                }
            ]
        }
    ],
    events: {
        redirectRequest: null
    },
    components: {
        originalRequest: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "redirectFrom"
            }
        },
        redirectRequest: {
            type: "fluid.test.express.request",
            createOnEvent: "redirectRequest",
            options: {
                path: "{arguments}.0",
                listeners: {
                    "onCreate.send": {
                        func: "{that}.send",
                        args: []
                    }
                }
            }
        }
    }
});
