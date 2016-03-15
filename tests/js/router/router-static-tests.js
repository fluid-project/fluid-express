/*

    Tests for our wrapper surrounding the Express "static" router module.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes");
require("./fixtures");
require("./router-static-caseholder");

fluid.defaults("gpii.express.tests.router.static.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
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
            type: "gpii.express.tests.router.static.caseHolder"
        }
    }
});

gpii.express.tests.router["static"].testEnvironment();