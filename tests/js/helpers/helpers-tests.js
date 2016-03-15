/*

  We provide some "helper" grades to assist other people in test routers and other components that run in conjunction
  with an instance of `gpii.express`.  These tests specifically exercise those test components.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes.js");
require("./helpers-caseholder");

fluid.defaults("gpii.express.tests.helpers.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:       7030,
    components: {
        testCaseHolder: {
            type: "gpii.express.tests.helpers.caseHolder"
        }
    }
});

gpii.express.tests.helpers.testEnvironment();
