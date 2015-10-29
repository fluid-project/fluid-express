/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");
var jqUnit       = require("jqUnit");

fluid.registerNamespace("gpii.express.tests.contentAware.caseHolder");

gpii.express.tests.contentAware.caseHolder.verifyResponse = function (response, body, expected) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 200);
    jqUnit.assertEquals("The body should be as expected...", expected, body);
};

fluid.defaults("gpii.express.tests.contentAware.request", {
    gradeNames: ["kettle.test.request.http"],
    path:       "{testEnvironment}.options.baseUrl",
    port:       "{testEnvironment}.options.port"
});

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.contentAware.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
    expected: {
        "default": "This is the default response.",
        text:      "This is the text response.",
        json:      "This is a JSON response." // Our dummy handler isn't actually sending JSON.
    },
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
            type: "gpii.express.tests.contentAware.request"
        },
        jsonRequest: {
            type: "gpii.express.tests.contentAware.request",
            options: {
                headers: {
                    accept: "application/json"
                }
            }
        },
        textRequest: {
            type: "gpii.express.tests.contentAware.request",
            options: {
                headers: {
                    accept: "text/html"
                }
            }
        }
    }
});
