/* Tests for the "middleware" grade and "wrapper" modules for common Express middleware. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes.js");

// We borrow a router from the router tests to help in testing middleware isolation
require("../router/fixtures");
require("./headerMiddleware-caseholder");

fluid.defaults("gpii.tests.express.headerMiddleware.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
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
                    hello: {
                        type: "gpii.tests.express.router.hello",
                        options: {
                            components: {
                                deepMiddleware: {
                                    type: "gpii.express.middleware.headerSetter",
                                    options: {
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

gpii.tests.express.headerMiddleware.testEnvironment();
