/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.express.errorMiddleware.caseHolder");

// kettle.requestUncaughtExceptionHandler = function (err) {
gpii.tests.express.errorMiddleware.caseHolder.handleErrorHandlerError = function (err) {
    if (err) {
        jqUnit.assert("There was an error, as expected...");
    }
};

fluid.defaults("gpii.tests.express.errorMiddleware.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    expected: {
        string: "The root error handler responded.",
        simple: {
            isError: true,
            message: "Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?"

        },
        complex: {
            componentOptions: "are good",
            literalValues:    "are also fine",
            errorWrapper:     { isError: true, message: "Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?"},
            requestMethod:    "GET"
        },
        overlyOptimistic: { message: "Seems like everything is fine." },
        nested: "The deep error handler responded."
    },
    rawModules: [
        {
            name: "Testing error handling middleware...",
            tests: [
                {
                    name: "Testing an error handler that returns a string...",
                    type: "test",
                    sequence: [
                        {
                            func: "{stringRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            event:    "{stringRequest}.events.onComplete",
                            args:    ["The string response should be as expected...", "{that}.options.expected.string", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing an error handler that returns the defaults (the original error)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{simpleRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertDeepEq",
                            event:    "{simpleRequest}.events.onComplete",
                            args:    ["The original error response should be returned...", "{that}.options.expected.simple", "@expand:JSON.parse({arguments}.0)"]
                        }
                    ]
                },
                {
                    name: "Testing an error handler that returns a transformed error...",
                    type: "test",
                    sequence: [
                        {
                            func: "{complexRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertDeepEq",
                            event:    "{complexRequest}.events.onComplete",
                            args:    ["The transformed error response should be returned...", "{that}.options.expected.complex", "@expand:JSON.parse({arguments}.0)"]
                        }
                    ]
                },
                {
                    name: "Testing a nested error handler...",
                    type: "test",
                    sequence: [
                        {
                            func: "{nestedRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            event:    "{nestedRequest}.events.onComplete",
                            args:    ["The nested error handler should have responded...", "{that}.options.expected.nested", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Test error handling after a response has been sent...",
                    type: "test",
                    expect: 2,
                    sequence: [
                        {
                            funcName: "fluid.failureEvent.addListener",
                            args:     [gpii.tests.express.errorMiddleware.caseHolder.handleErrorHandlerError, "jqUnit", "before:fail"]
                        },
                        {
                            func: "{overlyOptimisticRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertDeepEq",
                            event:    "{overlyOptimisticRequest}.events.onComplete",
                            args:     ["The optimistic middleware response should have been preserved...", "{that}.options.expected.overlyOptimistic", "@expand:JSON.parse({arguments}.0)"]
                        },
                        {
                            func: "fluid.failureEvent.removeListener",
                            args: ["jqUnit"]
                        }
                    ]
                },
                {
                    name: "Testing the root error handler payload...",
                    type: "test",
                    sequence: [
                        {
                            func: "{rootRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            event:    "{rootRequest}.events.onComplete",
                            args:    ["The root error handler should have responded...", "{that}.options.expected.string", "{arguments}.0"]
                        },
                        {
                            func: "gpii.test.express.checkHeader",
                            args: ["A custom request header should have been set for the error...", "{rootRequest}.nativeResponse", "My-Request-Went-To-Hell", "and all I got was this lousy header..."] // message, response, header, expected
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        stringRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "string"
            }
        },
        simpleRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "simple"
            }
        },
        complexRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "complex"
            }
        },
        nestedRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "nested"
            }
        },
        overlyOptimisticRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "overlyOptimistic"
            }
        },
        rootHeaderRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: ""
            }
        },
        rootRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: ""
            }
        }
    }
});
