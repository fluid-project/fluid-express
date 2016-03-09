/* Tests for the "middleware" grade and "wrapper" modules for common Express middleware. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes.js");

// We borrow a router from the router tests to help in testing middleware isolation
require("../router/test-router-hello");
require("./headerMiddleware-caseholder");

fluid.defaults("gpii.express.tests.headerMiddleware.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    port:   7531,
    baseUrl: "http://localhost:7531/",
    events: {
        constructServer: null,
        onStarted: null
    },
    components: {
        express: {
            createOnEvent: "constructServer",
            type: "gpii.express",
            options: {
                events: {
                    onStarted: "{testEnvironment}.events.onStarted"
                },
                config: {
                    express: {
                        port: "{testEnvironment}.options.port",
                        baseUrl: "{testEnvironment}.options.baseUrl",
                        views:   "%gpii-express/tests/views",
                        session: {
                            secret: "Printer, printer take a hint-ter."
                        }
                    }
                },
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
                        type: "gpii.express.tests.router.hello",
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
            type: "gpii.express.tests.headerMiddleware.caseHolder"
        }
    }
});

gpii.express.tests.headerMiddleware.testEnvironment();
