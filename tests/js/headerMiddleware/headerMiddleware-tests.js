/*

    Tests for the "header setter" middleware.

*/
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes.js");

require("./headerMiddleware-caseholder");

fluid.defaults("fluid.tests.express.headerMiddleware.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7531,
    components: {
        express: {
            options: {
                components: {
                    topLevelMiddleware: {
                        type: "fluid.express.middleware.headerSetter",
                        options: {
                            priority: "first",
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
                        type: "fluid.express.router",
                        options: {
                            path: "/hello",
                            components: {
                                deepMiddleware: {
                                    type: "fluid.express.middleware.headerSetter",
                                    options: {
                                        priority: "first",
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
                                    type: "fluid.test.express.middleware.hello"
                                }
                            }

                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.headerMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.headerMiddleware.testEnvironment");
