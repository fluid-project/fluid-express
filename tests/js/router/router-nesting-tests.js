/*

    Tests for router "nesting".

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes.js");
require("./fixtures");
require("./router-nesting-caseholder");

fluid.defaults("gpii.express.tests.router.nesting.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:   7532,
    components: {
        express: {
            options: {
                components: {
                    hello: {
                        type: "gpii.express.tests.router.hello",
                        options: {
                            components: {
                                world: {
                                    type: "gpii.express.tests.router.hello",
                                    options: {
                                        path:    "/world",
                                        message: "Hello, yourself"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.router.nesting.caseHolder"
        }
    }
});

gpii.express.tests.router.nesting.testEnvironment();
