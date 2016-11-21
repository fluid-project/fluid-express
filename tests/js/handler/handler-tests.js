/* eslint-env node */
/* Tests for the "express" and "router" module */
"use strict";
var fluid = require("infusion");

require("../includes.js");
require("./handler-caseholder");

fluid.defaults("gpii.tests.express.handler.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.tests.express.handler.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.handler.testEnvironment");
