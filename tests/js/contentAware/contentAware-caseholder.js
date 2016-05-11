"use strict";
var fluid  = require("infusion");

fluid.defaults("gpii.tests.express.contentAware.request", {
    gradeNames: ["gpii.test.express.request"],
    endpoint:   ""
});

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.tests.express.contentAware.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    expected: {
        "default": "This is the default response.",
        text:      "This is the text response.",
        json:      "This is a JSON response.", // Our dummy handler isn't actually sending JSON.
        unhandled: {isError: true, message: "Could not find an appropriate handler for the content types you accept." }
    },
    rawModules: [
        {
            name: "Testing `content aware` grade...",
            tests: [
                {
                    name: "Testing with no accepts headers...",
                    type: "test",
                    sequence: [
                        {
                            func: "{defaultRequest}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event:    "{defaultRequest}.events.onComplete",
                            args:     ["{defaultRequest}.nativeResponse", "{arguments}.0", "{caseHolder}.options.expected.default"]
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
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event:    "{jsonRequest}.events.onComplete",
                            args:     ["{jsonRequest}.nativeResponse", "{arguments}.0", "{caseHolder}.options.expected.json"]
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
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event:    "{textRequest}.events.onComplete",
                            args:     ["{textRequest}.nativeResponse", "{arguments}.0", "{caseHolder}.options.expected.text"]
                        }
                    ]
                },
                {
                    name: "Confirming that an error is thrown if no handler is found (because there are no handlers)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{noHandlerRequest}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyJSONContent",
                            event:    "{noHandlerRequest}.events.onComplete",
                            args:     ["{noHandlerRequest}.nativeResponse", "{arguments}.0", "{caseHolder}.options.expected.unhandled"]
                        }
                    ]
                },
                {
                    name: "Confirming that an error is thrown if no handler is found (because the request is too picky)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{pickyRequest}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyJSONContent",
                            event:    "{pickyRequest}.events.onComplete",
                            args:     ["{pickyRequest}.nativeResponse", "{arguments}.0", "{caseHolder}.options.expected.unhandled"]
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
            type: "gpii.tests.express.contentAware.request"
        },
        jsonRequest: {
            type: "gpii.tests.express.contentAware.request",
            options: {
                headers: {
                    accept: "application/json"
                }
            }
        },
        textRequest: {
            type: "gpii.tests.express.contentAware.request",
            options: {
                headers: {
                    accept: "text/html"
                }
            }
        },
        noHandlerRequest: {
            type: "gpii.tests.express.contentAware.request",
            options: {
                endpoint: "hcf"
            }
        },
        pickyRequest: {
            type: "gpii.tests.express.contentAware.request",
            options: {
                headers: {
                    accept: "candy/floss"
                }
            }
        }

    }
});
