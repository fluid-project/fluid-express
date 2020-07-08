/*

    Tests for router "nesting".

*/
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes.js");
require("./router-nesting-caseholder");

fluid.defaults("fluid.tests.express.router.nesting.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7532,
    components: {
        express: {
            options: {
                components: {
                    helloPathRouter: {
                        type: "fluid.express.router",
                        options: {
                            path: "/hello",
                            components: {
                                helloMiddleware: {
                                    type: "fluid.test.express.middleware.hello",
                                    options: {
                                        priority: "last"
                                    }
                                },
                                worldPathRouter: {
                                    type: "fluid.express.router",
                                    options: {
                                        path:    "/world",
                                        components: {
                                            worldMiddleware: {
                                                type: "fluid.test.express.middleware.hello",
                                                options: {
                                                    message: "Hello, yourself"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.router.nesting.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.router.nesting.testEnvironment");
