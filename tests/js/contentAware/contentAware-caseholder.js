"use strict";
var fluid  = require("infusion");

fluid.defaults("fluid.tests.express.contentAware.request", {
    gradeNames: ["fluid.test.express.request"],
    endpoint:   ""
});

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("fluid.tests.express.contentAware.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
                            listener: "fluid.test.express.helpers.verifyJSONContent",
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
                            listener: "fluid.test.express.helpers.verifyJSONContent",
                            event:    "{pickyRequest}.events.onComplete",
                            args:     ["{pickyRequest}.nativeResponse", "{arguments}.0", "{caseHolder}.options.expected.unhandled"]
                        }
                    ]
                },
                {
                    name: "Testing with a secondary request type (array of content types)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{secondaryContentTypeRequest}.send"
                        },
                        {
                            listener: "fluid.test.express.helpers.verifyStringContent",
                            event:    "{secondaryContentTypeRequest}.events.onComplete",
                            args:     ["{secondaryContentTypeRequest}.nativeResponse", "{arguments}.0", "{caseHolder}.options.expected.json"]
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
            type: "fluid.tests.express.contentAware.request"
        },
        jsonRequest: {
            type: "fluid.tests.express.contentAware.request",
            options: {
                headers: {
                    accept: "application/json"
                }
            }
        },
        textRequest: {
            type: "fluid.tests.express.contentAware.request",
            options: {
                headers: {
                    accept: "text/html"
                }
            }
        },
        noHandlerRequest: {
            type: "fluid.tests.express.contentAware.request",
            options: {
                endpoint: "hcf"
            }
        },
        pickyRequest: {
            type: "fluid.tests.express.contentAware.request",
            options: {
                headers: {
                    accept: "candy/floss"
                }
            }
        },
        secondaryContentTypeRequest: {
            type: "fluid.tests.express.contentAware.request",
            options: {
                headers: {
                    accept: "application/secondary"
                }
            }
        }
    }
});
