/* Test environment for the "router" grade and "wrapper" modules for common Express routers. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes.js");
require("./fixtures");
require("./router-wildcard-caseholder");

fluid.defaults("gpii.tests.express.router.wildcard.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
    port:   7522,
    components: {
        express: {
            options: {
                components: {
                    wildcard: {
                        type: "gpii.tests.express.router.hello",
                        options: {
                            path:    "/wildcard/*",
                            message: "Hello, wild world."
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.router.wildcard.caseHolder"
        }
    }
});

gpii.tests.express.router.wildcard.testEnvironment();
