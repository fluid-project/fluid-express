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

fluid.defaults("gpii.tests.express.router.nesting.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
    port:   7532,
    components: {
        express: {
            options: {
                components: {
                    hello: {
                        type: "gpii.tests.express.router.hello",
                        options: {
                            components: {
                                world: {
                                    type: "gpii.tests.express.router.hello",
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
            type: "gpii.tests.express.router.nesting.caseHolder"
        }
    }
});

gpii.tests.express.router.nesting.testEnvironment();
