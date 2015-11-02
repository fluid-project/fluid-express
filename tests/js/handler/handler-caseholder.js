/* Tests for the "express" and "router" module */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("jqUnit");

fluid.registerNamespace("gpii.express.tests.handler.caseHolder");

fluid.defaults("gpii.express.tests.handler.testHandler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "fluid.identity"
        }
    }
});

gpii.express.tests.handler.caseHolder.createWithOptions = function (options, errorTexts) {
    jqUnit.expectFrameworkDiagnostic("Creating component with bogus options...", function () {
        gpii.express.tests.handler.testHandler(options);
    }, errorTexts);
};

gpii.express.tests.handler.caseHolder.sendWithoutResponse = function (errorTexts) {
    jqUnit.expectFrameworkDiagnostic("Sending response with bogus options...", function () {
        gpii.express.handler.sendResponse({});
    }, errorTexts);
};


fluid.defaults("gpii.express.tests.handler.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [
        {
            tests: [
                {
                    name: "Try to create a handler without a request option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.express.tests.handler.caseHolder.createWithOptions",
                            args:     [{ response: true }, ["without a request object"]] // options, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to create a handler without a response option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.express.tests.handler.caseHolder.createWithOptions",
                            args:     [{ request: true }, ["without a response object"]] // options, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to send a response without the required options...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.express.tests.handler.caseHolder.sendWithoutResponse",
                            args:     ["Cannot send response"]
                        }
                    ]
                }
            ]
        }
    ]
});
