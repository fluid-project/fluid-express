/* Test environment for the "router" grade and "wrapper" modules for common Express routers. */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");

fluid.setLogging(true);

var path         = require("path");

// Load all of the components to be tested and our test cases
require("./includes.js");

var viewDir    = path.resolve(__dirname, "../../views");
var contentDir = path.resolve(__dirname, "../../html");

fluid.defaults("gpii.express.tests.router.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment", "autoInit"],
    port:   7532,
    baseUrl: "http://localhost:7532/",
    events: {
        constructServer: null,
        onStarted: null
    },
    components: {
        express: {       // instance of component under test
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
                        views:   viewDir,
                        session: {
                            secret: "Printer, printer take a hint-ter."
                        }
                    }
                },
                components: {
                    hello: {
                        type: "gpii.express.tests.router.hello",
                        options: {
                            components: {
                                reqview: {
                                    type: "gpii.express.tests.router.reqview",
                                    options: {
                                        path: "/rv",
                                        components: {
                                            reqviewChild: {
                                                type: "gpii.express.tests.router.hello",
                                                options: {
                                                    path:    "/jailed",
                                                    message: "This is provided by a module nested four levels deep.",
                                                    components: {
                                                        cookieparser: {
                                                            type: "gpii.express.middleware.cookieparser"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                world: {
                                    type: "gpii.express.tests.router.hello",
                                    options: {
                                        components: {
                                            session: {
                                                type: "gpii.express.middleware.session"
                                            }
                                        },
                                        path:    "/world",
                                        message: "Hello, yourself"
                                    }
                                }
                            }
                        }
                    },
                    wildcard: {
                        type: "gpii.express.tests.router.hello",
                        options: {
                            path:    "/wildcard/*",
                            message: "Hello, wild world."
                        }
                    },
                    staticRouter: {
                        type: "gpii.express.router.static",
                        options: {
                            path:    "/",
                            content: contentDir
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.router.caseHolder"
        }
    }
});

gpii.express.tests.router.testEnvironment();
