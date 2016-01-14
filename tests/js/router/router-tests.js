/* Test environment for the "router" grade and "wrapper" modules for common Express routers. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("./includes.js");

var viewDir    = fluid.module.resolvePath("%gpii-express/tests/views");
var contentDir = fluid.module.resolvePath("%gpii-express/tests/html");

fluid.registerNamespace("gpii.express.tests.router.deepParamHandler");
gpii.express.tests.router.deepParamHandler.handleRequest = function (that) {
    that.sendResponse(200, { ok: true, params: that.request.params});
};

fluid.defaults("gpii.express.tests.router.deepParamHandler", {
    gradeName: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "gpii.express.tests.router.deepParamHandler.handleRequest",
            args: ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.tests.router.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
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
                    // This should be loaded first to detect regressions on GPII-1279
                    staticRouter: {
                        type: "gpii.express.router.static",
                        options: {
                            path:    "/",
                            content: contentDir
                        }
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
                    params: {
                        type: "gpii.express.tests.router.params",
                        options: {
                            path: "/params/:myVar",
                            components: {
                                deepRouter: {
                                    type: "gpii.express.requestAware.router",
                                    options: {
                                        path: "/deep",
                                        routerOptions: {
                                            mergeParams: true
                                        },
                                        handlerGrades: ["gpii.express.tests.router.deepParamHandler"]
                                    }
                                }
                            }
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
