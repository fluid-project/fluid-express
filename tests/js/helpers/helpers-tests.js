/*

  We provide some "helper" grades to assist other people in test routers and other components that run in conjunction
  with an instance of `gpii.express`.  These tests specifically exercise those test components.

 */
"use strict";
var fluid = require("infusion");

require("../includes.js");
require("./helpers-caseholder");

fluid.defaults("gpii.test.express.helpers.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:       7030,
    components: {
        testCaseHolder: {
            type: "gpii.test.express.helpers.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.test.express.helpers.testEnvironment");
