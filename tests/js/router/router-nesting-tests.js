/*

    Tests for router "nesting".

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes.js");
require("./router-nesting-caseholder");

fluid.defaults("gpii.tests.express.router.nesting.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:   7532,
    components: {
        express: {
            options: {
                components: {
                    helloPathRouter: {
                        type: "gpii.express.router",
                        options: {
                            path: "/hello",
                            components: {
                                worldPathRouter: {
                                    type: "gpii.express.router",
                                    options: {
                                        path:    "/world",
                                        components: {
                                            worldMiddleware: {
                                                type: "gpii.test.express.middleware.hello",
                                                options: {
                                                    message: "Hello, yourself"
                                                }
                                            }
                                        }
                                    }
                                },
                                helloMiddleware: {
                                    type: "gpii.test.express.middleware.hello",
                                    options: {
                                        priority: "last"
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
