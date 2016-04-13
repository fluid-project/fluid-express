"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

require("../includes");

fluid.registerNamespace("gpii.test.express.requestAware.caseHolder");

gpii.test.express.requestAware.caseHolder.testRequestAwareDelayedResponse = function (responseObject, response, body) {
    gpii.test.express.helpers.isSaneResponse(response, body, 200);
    responseObject.body = body;
};

gpii.test.express.requestAware.caseHolder.testRequestAwareTimeoutResponse = function (response, body) {
    gpii.test.express.helpers.isSaneResponse(response, body, 500);
};

// Look at two sequential requests and confirm that they are different.
gpii.test.express.requestAware.caseHolder.testRequestAwareIntegrity = function (firstResponseString, secondResponseString) {
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


fluid.defaults("gpii.test.express.requestAware.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
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
                            listener: "gpii.test.express.requestAware.caseHolder.testRequestAwareDelayedResponse",
                            event:    "{requestAwareInstrumentedRequest}.events.onComplete",
                            args:     ["{requestAwareInstrumentedRequest}", "{requestAwareInstrumentedRequest}.nativeResponse", "{arguments}.0"]
                        },
                        {
                            func: "{requestAwareSecondInstrumentedRequest}.send"
                        },
                        {
                            listener: "gpii.test.express.requestAware.caseHolder.testRequestAwareIntegrity",
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
                            listener: "gpii.test.express.requestAware.caseHolder.testRequestAwareDelayedResponse",
                            event:    "{requestAwareDelayedRequest}.events.onComplete",
                            args:     ["{requestAwareDelayedRequest}", "{requestAwareDelayedRequest}.nativeResponse", "{arguments}.0"]
                        },
                        {
                            func: "{requestAwareSecondDelayedRequest}.send"
                        },
                        {
                            listener: "gpii.test.express.requestAware.caseHolder.testRequestAwareIntegrity",
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
                            listener: "gpii.test.express.requestAware.caseHolder.testRequestAwareTimeoutResponse",
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
            type: "gpii.test.express.request",
            options: {
                endpoint: "instrumented"
            }
        },
        requestAwareSecondInstrumentedRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "instrumented"
            }
        },
        requestAwareDelayedRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "delayed"
            }
        },
        requestAwareSecondDelayedRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "delayed"
            }
        },
        requestAwareTimeoutRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "timeout"
            }
        }
    }
});
