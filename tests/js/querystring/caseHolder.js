"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.defaults("gpii.tests.express.querystring.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    invokers: {
        testPayload: {
            funcName: "fluid.notImplemented"
        }
    }
});