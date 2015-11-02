/* Tests for the "express" and "router" module */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("jqUnit");

require("../lib/test-helpers");

fluid.registerNamespace("gpii.express.tests.requestAware.caseHolder");

gpii.express.tests.requestAware.caseHolder.testRequestAwareDelayedResponse = function (responseObject, response, body) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 200);
    responseObject.body = body;
};

gpii.express.tests.requestAware.caseHolder.testRequestAwareTimeoutResponse = function (response, body) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 500);
};

// Look at two sequential requests and confirm that they are different.
gpii.express.tests.requestAware.caseHolder.testRequestAwareIntegrity = function (firstResponseString, secondResponseString) {
    // If we can evolve the response into JSON, we do.
    var firstResponseBody  = firstResponseString;
    var secondResponseBody = secondResponseString;
    try {
        firstResponseBody  = JSON.parse(firstResponseString);
        secondResponseBody = JSON.parse(secondResponseString);
    }
    catch (e) {
        // Do nothing
    }

    jqUnit.assertDeepNeq("Two sequential requests should be different.", firstResponseBody, secondResponseBody);
};


// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.requestAware.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing a basic 'request aware' component...",
                    type: "test",
                    sequence: [
                        {
                            func: "{requestAwareInstrumentedRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.requestAware.caseHolder.testRequestAwareDelayedResponse",
                            event:    "{requestAwareInstrumentedRequest}.events.onComplete",
                            args:     ["{requestAwareInstrumentedRequest}", "{requestAwareInstrumentedRequest}.nativeResponse", "{arguments}.0"]
                        },
                        {
                            func: "{requestAwareSecondInstrumentedRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.requestAware.caseHolder.testRequestAwareIntegrity",
                            event:    "{requestAwareSecondInstrumentedRequest}.events.onComplete",
                            args:     ["{requestAwareInstrumentedRequest}.body", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing a slow but responsive 'request aware' component...",
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
                        }
                    ]
                },
                {
                    name: "Testing a nonresponsive 'request aware' component...",
                    type: "test",
                    sequence: [
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
        requestAwareInstrumentedRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/instrumented"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        requestAwareSecondInstrumentedRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/instrumented"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        requestAwareDelayedRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/delayed"]
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
                        args:     ["{testEnvironment}.options.baseUrl", "/delayed"]
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
                        args:     ["{testEnvironment}.options.baseUrl", "/timeout"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        }
    }
});
