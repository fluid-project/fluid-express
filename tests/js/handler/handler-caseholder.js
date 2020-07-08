"use strict";
var fluid  = require("infusion");
var jqUnit = require("node-jqunit");

fluid.registerNamespace("fluid.tests.express.handler.caseHolder");

fluid.defaults("fluid.tests.express.handler.testHandler", {
    gradeNames: ["fluid.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "fluid.identity"
        }
    }
});

fluid.tests.express.handler.caseHolder.createWithOptions = function (dispatcher, request, response, next, errorTexts) {
    jqUnit.expectFrameworkDiagnostic("Creating component with bogus options...", function () {
        dispatcher.events.onRequest.fire({ gradeNames: ["fluid.tests.express.handler.testHandler"] }, request, response, next);
    }, errorTexts);
};

fluid.tests.express.handler.caseHolder.sendWithoutResponse = function (errorTexts) {
    jqUnit.expectFrameworkDiagnostic("Sending response with bogus options...", function () {
        fluid.express.handler.sendResponse({});
    }, errorTexts);
};


fluid.defaults("fluid.tests.express.handler.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [
        {
            name: "Testing handlers...",
            tests: [
                {
                    name: "Try to create a handler without a request option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "fluid.tests.express.handler.caseHolder.createWithOptions",
                            args:     ["{caseHolder}.dispatcher", null, true, fluid.identity, ["without a 'request' object"]] // request, response, next, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to create a handler without a response option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "fluid.tests.express.handler.caseHolder.createWithOptions",
                            args:     ["{caseHolder}.dispatcher", true, null, fluid.identity, ["without a 'response' object"]] // request, response, next, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to create a handler without a response option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "fluid.tests.express.handler.caseHolder.createWithOptions",
                            args:     ["{caseHolder}.dispatcher", true, true, null, ["without a 'next' object"]] // options, request, response, next, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to send a response without the required options...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "fluid.tests.express.handler.caseHolder.sendWithoutResponse",
                            args:     ["Cannot send response"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        dispatcher: {
            type: "fluid.express.handlerDispatcher"
        }
    }
});
