"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.express.handler.caseHolder");

fluid.defaults("gpii.tests.express.handler.testHandler", {
    gradeNames: ["gpii.express.handler"],
    // We are not creating these dynamically, so we need to redefine these two options for our tests to run.
    request:    false,
    response:   false,
    invokers: {
        handleRequest: {
            funcName: "fluid.identity"
        }
    }
});

gpii.tests.express.handler.caseHolder.createWithOptions = function (options, errorTexts) {
    jqUnit.expectFrameworkDiagnostic("Creating component with bogus options...", function () {
        gpii.tests.express.handler.testHandler(options);
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
                            args:     [{ response: true }, ["without a request object"]] // options, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to create a handler without a response option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.tests.express.handler.caseHolder.createWithOptions",
                            args:     [{ request: true }, ["without a response object"]] // options, errorTexts
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
    ]
});
