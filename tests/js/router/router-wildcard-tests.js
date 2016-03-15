/* Test environment for the "router" grade and "wrapper" modules for common Express routers. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes.js");
require("./fixtures");
require("./router-wildcard-caseholder");

fluid.defaults("gpii.express.tests.router.wildcard.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:   7522,
    components: {
        express: {
            options: {
                components: {
                    wildcard: {
                        type: "gpii.express.tests.router.hello",
                        options: {
                            path:    "/wildcard/*",
                            message: "Hello, wild world."
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.router.wildcard.caseHolder"
        }
    }
});

gpii.express.tests.router.wildcard.testEnvironment();
