/*

    Tests for our wrapper surrounding the Express "static" router module.

 */
"use strict";
var fluid = require("infusion");

require("../includes");
require("./router-static-caseholder");

fluid.defaults("gpii.tests.express.router.static.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:   7432,
    components: {
        express: {
            options: {
                components: {
                    staticMultiball: {
                        type: "gpii.express.router.static",
                        options: {
                            path:    "/multiball",
                            content: ["%gpii-express/tests/data/primary", "%gpii-express/tests/data/secondary"]
                        }
                    },
                    staticRoot: {
                        type: "gpii.express.router.static",
                        options: {
                            path:    "/",
                            content: "%gpii-express/tests/html"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.router.static.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.router.static.testEnvironment");