/* Tests for the "express" and "router" module */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.express.tests.staticRouter.caseHolder");

gpii.express.tests.staticRouter.caseHolder.createWithOptions = function (options, errorTexts) {
    jqUnit.expectFrameworkDiagnostic("Creating component with bogus options...", function () {
        gpii.express.router["static"](options);
    }, errorTexts);
};

fluid.defaults("gpii.express.tests.staticRouter.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [
        {
            tests: [
                {
                    name: "Try to create a static router without a path option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.express.tests.staticRouter.caseHolder.createWithOptions",
                            args:     [{ content: "foo" }, ["You must configure a path"]] // options, errorTexts
                        }
                    ]
                },
                {
                    name: "Try to create a static router without a content option...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "gpii.express.tests.staticRouter.caseHolder.createWithOptions",
                            args:     [{ path: "foo" }, ["You must configure a content value"]] // options, errorTexts
                        }
                    ]
                }
            ]
        }
    ]
});
