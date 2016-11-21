/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.express.handler.caseHolder");

fluid.defaults("gpii.tests.express.handler.testHandler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "fluid.identity"
        }
    }
});

gpii.tests.express.handler.caseHolder.createWithOptions = function (dispatcher, request, response, next, errorTexts) {
    jqUnit.expectFrameworkDiagnostic("Creating component with bogus options...", function () {
        dispatcher.events.onRequest.fire({ gradeNames: ["gpii.tests.express.handler.testHandler"] }, request, response, next);
    }, errorTexts);
};

gpii.tests.express.handler.caseHolder.sendWithoutResponse = function (errorTexts) {
    jqUnit.expectFrameworkDiagnostic("Sending response with bogus options...", function () {
        gpii.express.handler.sendResponse({});
    }, errorTexts);
};


fluid.defaults("gpii.tests.express.handler.caseHolder", {
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
                            funcName: "gpii.tests.express.handler.caseHolder.createWithOptions",
                            args:     ["{caseHolder}.dispatcher", null, true, fluid.identity, ["without a 'request' object"]] // request, response, next, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to create a handler without a response option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.tests.express.handler.caseHolder.createWithOptions",
                            args:     ["{caseHolder}.dispatcher", true, null, fluid.identity, ["without a 'response' object"]] // request, response, next, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to create a handler without a response option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.tests.express.handler.caseHolder.createWithOptions",
                            args:     ["{caseHolder}.dispatcher", true, true, null, ["without a 'next' object"]] // options, request, response, next, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to send a response without the required options...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.tests.express.handler.caseHolder.sendWithoutResponse",
                            args:     ["Cannot send response"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        dispatcher: {
            type: "gpii.express.handlerDispatcher"
        }
    }
});
