/* eslint-env node */
/*

    Tests for the "header setter" middleware.

*/
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes.js");

require("./headerMiddleware-caseholder");

fluid.defaults("gpii.tests.express.headerMiddleware.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:   7531,
    components: {
        express: {
            options: {
                components: {
                    topLevelMiddleware: {
                        type: "gpii.express.middleware.headerSetter",
                        options: {
                            headers: {
                                queryVar: {
                                    fieldName: "Top-Level-Query-Variable",
                                    template:  "%variable",
                                    dataRules: {
                                        variable: "request.query.variable"
                                    }
                                },
                                staticTemplate: {
                                    fieldName: "Static-Template",
                                    template:  "static template",
                                    // TODO: Make it possible to omit this
                                    dataRules: {

                                    }
                                },
                                staticRules: {
                                    fieldName: "Static-Rules",
                                    template:  "%variable",
                                    dataRules: {
                                        variable: { literalValue: "static rules"}
                                    }
                                }
                            }
                        }
                    },
                    helloPathRouter: {
                        type: "gpii.express.router",
                        options: {
                            path: "/hello",
                            components: {
                                deepMiddleware: {
                                    type: "gpii.express.middleware.headerSetter",
                                    options: {
                                        priority: "before:helloMiddleware",
                                        headers: {
                                            queryVar: {
                                                fieldName: "Deep-Query-Variable",
                                                template:  "%variable",
                                                dataRules: {
                                                    variable: "request.query.variable"
                                                }
                                            }
                                        }
                                    }
                                },
                                helloMiddleware: {
                                    type: "gpii.test.express.middleware.hello"
                                }
                            }

                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.headerMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.headerMiddleware.testEnvironment");
