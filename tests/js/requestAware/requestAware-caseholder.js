/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");
var jqUnit       = require("jqUnit");

require("../lib/test-helpers");

fluid.registerNamespace("gpii.express.tests.requestAware.caseHolder");

fluid.setLogging(true);


gpii.express.tests.requestAware.caseHolder.testRequestAwareDelayedResponse = function (responseObject, response, body) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 200);
    responseObject.body = body;
};

gpii.express.tests.requestAware.caseHolder.testRequestAwareTimeoutResponse = function (response, body) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 500);
};

// Look at two sequential requests and confirm that they are different.
gpii.express.tests.requestAware.caseHolder.testRequestAwareIntegrity = function (firstResponseString, secondResponseString) {
    var firstResponseBody  = JSON.parse(firstResponseString);
    var secondResponseBody = JSON.parse(secondResponseString);
    jqUnit.assertDeepNeq("Two sequential requests should be different.", firstResponseBody, secondResponseBody);
};


// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.requestAware.caseHolder", {
    gradeNames: ["autoInit", "fluid.test.testCaseHolder"],
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
                    name: "Testing the 'request aware' abstract component...",
                    type: "test",
                    sequence: [
                        {
                            func: "{requestAwareDelayedRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.requestAware.caseHolder.testRequestAwareDelayedResponse",
                            event:    "{requestAwareDelayedRequest}.events.onComplete",
                            args:     ["{requestAwareDelayedRequest}", "{requestAwareDelayedRequest}.nativeResponse", "{arguments}.0"]
                        },
                        {
                            func: "{requestAwareSecondDelayedRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.requestAware.caseHolder.testRequestAwareIntegrity",
                            event:    "{requestAwareSecondDelayedRequest}.events.onComplete",
                            args:     ["{requestAwareDelayedRequest}.body", "{arguments}.0"]
                        },
                        {
                            func: "{requestAwareTimeoutRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.requestAware.caseHolder.testRequestAwareTimeoutResponse",
                            event:    "{requestAwareTimeoutRequest}.events.onComplete",
                            args:     ["{requestAwareTimeoutRequest}.nativeResponse", "{arguments}.0"]
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
        requestAwareDelayedRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/requestAware?action=delayed"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        requestAwareSecondDelayedRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/requestAware?action=delayed"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        requestAwareTimeoutRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/requestAware?action=timeout"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        }
    }
});
