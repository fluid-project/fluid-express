/*

    Tests for our wrapper surrounding the Express "static" router module.

 */
"use strict";
var fluid = require("infusion");

require("../includes");
require("./router-static-caseholder");

fluid.defaults("fluid.tests.express.router.static.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7432,
    components: {
        express: {
            options: {
                components: {
                    staticMultiball: {
                        type: "fluid.express.router.static",
                        options: {
                            priority: "first",
                            path:    "/multiball",
                            content: ["%fluid-express/tests/data/primary", "%fluid-express/tests/data/secondary"]
                        }
                    },
                    staticRoot: {
                        type: "fluid.express.router.static",
                        options: {
                            path:    "/",
                            content: "%fluid-express/tests/html"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.router.static.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.router.static.testEnvironment");
