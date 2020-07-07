/* Tests for the "express" and "router" module */
"use strict";
var fluid = require("infusion");

require("../includes.js");
require("./handler-caseholder");

fluid.defaults("fluid.tests.express.handler.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "fluid.tests.express.handler.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.handler.testEnvironment");
