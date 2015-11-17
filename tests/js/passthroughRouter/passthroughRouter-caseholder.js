/* Tests for the "express" and "router" module */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.express.tests.passthroughRouter.caseHolder");

gpii.express.tests.passthroughRouter.caseHolder.verifyResponse = function (response, body, expected) {
    gpii.express.tests.helpers.isSaneResponse(response, body, 200);
    jqUnit.assertEquals("The body should be as expected...", expected, body);
};

fluid.defaults("gpii.express.tests.passthroughRouter.request", {
    gradeNames: ["kettle.test.request.http"],
    path:       {
        expander: {
            funcName: "fluid.stringTemplate",
            args:     ["%baseUrl%endpoint", { baseUrl: "{testEnvironment}.options.baseUrl", endpoint: "{that}.options.endpoint"}]
        }
    },
    port:       "{testEnvironment}.options.port"
});

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.passthroughRouter.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing top level...",
                    type: "test",
                    sequence: [
                        {
                            func: "{topRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.passthroughRouter.caseHolder.verifyResponse",
                            event:    "{topRequest}.events.onComplete",
                            args:     ["{topRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.top"]
                        }
                    ]
                },
                {
                    name: "Testing first (middle) level of nesting...",
                    type: "test",
                    sequence: [
                        {
                            func: "{middleRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.passthroughRouter.caseHolder.verifyResponse",
                            event:    "{middleRequest}.events.onComplete",
                            args:     ["{middleRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.middle"]
                        }
                    ]
                },
                {
                    name: "Testing deepest (bottom) level of nesting...",
                    type: "test",
                    sequence: [
                        {
                            func: "{bottomRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.passthroughRouter.caseHolder.verifyResponse",
                            event:    "{bottomRequest}.events.onComplete",
                            args:     ["{bottomRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.bottom"]
                        }
                    ]
                }
            ]
        }
    ],
    expected: {
        top:    "You are at the top.",
        middle: "You are in the middle.",
        bottom: "You are on the bottom."
    },
    components: {
        topRequest: {
            type: "gpii.express.tests.passthroughRouter.request",
            options: {
                endpoint: "top"
            }
        },
        middleRequest: {
            type: "gpii.express.tests.passthroughRouter.request",
            options: {
                endpoint: "top/middle"
            }
        },
        bottomRequest: {
            type: "gpii.express.tests.passthroughRouter.request",
            options: {
                endpoint: "top/middle/bottom"
            }
        }
    }
});
