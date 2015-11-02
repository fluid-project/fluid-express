/* Tests for the "express" and "router" module */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.defaults("gpii.express.tests.staticRouter.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.express.tests.staticRouter.caseHolder"
        }
    }
});

gpii.express.tests.staticRouter.testEnvironment();
