/*

    Tests for the "header setter" middleware.

*/
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes.js");

require("./redirectMiddleware-caseholder");

fluid.defaults("fluid.tests.express.redirectMiddleware.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7531,
    components: {
        express: {
            options: {
                components: {
                    topLevelMiddleware: {
                        type: "fluid.express.middleware.redirect",
                        options: {
                            path:        "/redirectFrom",
                            redirectUrl: "/redirectTo"
                        }
                    },
                    helloPathRouter: {
                        type: "fluid.test.express.middleware.hello",
                        options: {
                            path: "/redirectTo"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.redirectMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.redirectMiddleware.testEnvironment");
