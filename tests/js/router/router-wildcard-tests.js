/* Test environment for the "router" grade and "wrapper" modules for common Express routers. */
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes.js");
require("./router-wildcard-caseholder");

fluid.defaults("fluid.tests.express.router.wildcard.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7522,
    components: {
        express: {
            options: {
                components: {
                    wildcardPathRouter: {
                        type: "fluid.express.router",
                        options: {
                            path:    "/wildcard/*",
                            components: {
                                wildcardMiddleware: {
                                    type: "fluid.test.express.middleware.hello",
                                    options: {
                                        message: "Hello, wild world."
                                    }
                                }
                            }
                        }

                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.router.wildcard.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.router.wildcard.testEnvironment");
