/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");

fluid.setLogging(true);

var path         = require("path");

// Load all of the components to be tested
require("../index.js");

// Load the test infrastructure
require("./js/index.js");

// We use just the request-handling bits of the kettle stack in our tests, but we include the whole thing to pick up the base grades
require("../node_modules/kettle");
require("../node_modules/kettle/lib/test/KettleTestUtils");

var viewDir    = path.resolve(__dirname, "./views");
var contentDir = path.resolve(__dirname, "./html");

fluid.defaults("gpii.express.tests.expressTestTree", {
    gradeNames: ["fluid.test.testEnvironment", "autoInit"],
    port:   7531,
    baseUrl: "http://localhost/",
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
                    middleware: {
                        type: "gpii.express.tests.middleware.counter"
                    },
                    cookie: {
                        type: "gpii.express.tests.router.cookie"
                    },
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
                    },
                    reqview: {
                        type: "gpii.express.tests.router.reqview",
                        options: {
                            components: {
                                json: {
                                    type: "gpii.express.middleware.bodyparser.json"
                                },
                                urlencoded: {
                                    type: "gpii.express.middleware.bodyparser.urlencoded"
                                },
                                cookieparser: {
                                    type: "gpii.express.middleware.cookieparser"
                                },
                                session: {
                                    type: "gpii.express.middleware.session"
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.expressTestCaseHolder"
        }
    }
});

gpii.express.tests.expressTestTree({});
