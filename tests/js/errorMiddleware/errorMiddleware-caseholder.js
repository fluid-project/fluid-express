"use strict";
var fluid  = require("infusion");

fluid.registerNamespace("gpii.tests.express.errorMiddleware.caseHolder");

fluid.defaults("gpii.tests.express.errorMiddleware.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder"],

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
        nested: "The deep error handler responded."
    },

    rawModules: [
        {
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
                    name: "Testing the root error handler...",
                    type: "test",
                    sequence: [
                        {
                            func: "{rootRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            event:    "{rootRequest}.events.onComplete",
                            args:    ["The root error handler should have responded...", "{that}.options.expected.string", "{arguments}.0"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        stringRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "string"
            }
        },
        simpleRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "simple"
            }
        },
        complexRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "complex"
            }
        },
        nestedRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "nested"
            }
        },
        rootRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: ""
            }
        }
    }
});
