/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");
var jqUnit       = require("jqUnit");

require("../lib/test-helpers");

fluid.registerNamespace("gpii.express.tests.contentAware.caseHolder");

fluid.setLogging(true);


gpii.express.tests.contentAware.caseHolder.verifyResponse = function (response, body, expected) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 200);
    jqUnit.assertEquals("The body should be as expected...", expected, body);
};

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.contentAware.caseHolder", {
    gradeNames: ["autoInit", "fluid.test.testCaseHolder"],
    expected: {
        "default": "This is the default response.",
        text:      "This is the text response.",
        json:      "This is a JSON response." // Our dummy handler isn't actually sending JSON.
    },
    mergePolicy: {
        rawModules:    "noexpand",
        sequenceStart: "noexpand"
    },
    moduleSource: {
        funcName: "gpii.express.tests.helpers.addRequiredSequences",
        args:     ["{that}.options.sequenceStart", "{that}.options.rawModules"]
    },
    sequenceStart: [
        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
            func: "{testEnvironment}.events.constructServer.fire"
        },
        {
            listener: "fluid.identity",
            event: "{testEnvironment}.events.onStarted"
        }
    ],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing with no accepts headers...",
                    type: "test",
                    sequence: [
                        {
                            func: "{defaultRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.contentAware.caseHolder.verifyResponse",
                            event:    "{defaultRequest}.events.onComplete",
                            args:     ["{defaultRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.default"]
                        },
                        {
                            func: "{jsonRequest}.send"
                        }
                    ]
                },
                {
                    name: "Testing with application/json...",
                    type: "test",
                    sequence: [
                        {
                            func: "{jsonRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.contentAware.caseHolder.verifyResponse",
                            event:    "{jsonRequest}.events.onComplete",
                            args:     ["{jsonRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.json"]
                        }
                    ]
                },
                {
                    name: "Testing with text/html...",
                    type: "test",
                    sequence: [
                        {
                            func: "{textRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.contentAware.caseHolder.verifyResponse",
                            event:    "{textRequest}.events.onComplete",
                            args:     ["{textRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.text"]
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
        defaultRequest: {
            type: "kettle.test.request.http",
            options: {
                path:    "{testEnvironment}.options.baseUrl",
                port:    "{testEnvironment}.options.port"
            }
        },
        jsonRequest: {
            type: "kettle.test.request.http",
            options: {
                path:    "{testEnvironment}.options.baseUrl",
                port:    "{testEnvironment}.options.port",
                headers: {
                    accept: "application/json"
                }
            }
        },
        textRequest: {
            type: "kettle.test.request.http",
            options: {
                path:    "{testEnvironment}.options.baseUrl",
                port:    "{testEnvironment}.options.port",
                headers: {
                    accept: "text/html"
                }
            }
        }
    }
});
