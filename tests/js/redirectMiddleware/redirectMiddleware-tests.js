/* eslint-env node */
/*

    Tests for the "header setter" middleware.

*/
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes.js");

require("./redirectMiddleware-caseholder");

fluid.defaults("gpii.tests.express.redirectMiddleware.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:   7531,
    components: {
        express: {
            options: {
                components: {
                    topLevelMiddleware: {
                        type: "gpii.express.middleware.redirect",
                        options: {
                            path:        "/redirectFrom",
                            redirectUrl: "/redirectTo"
                        }
                    },
                    helloPathRouter: {
                        type: "gpii.test.express.middleware.hello",
                        options: {
                            path: "/redirectTo"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.redirectMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.redirectMiddleware.testEnvironment");
