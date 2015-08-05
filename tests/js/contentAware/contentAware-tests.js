/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");

fluid.setLogging(true);

var path         = require("path");

require("./includes.js");

var viewDir    = path.resolve(__dirname, "./views");

fluid.registerNamespace("gpii.express.tests.contentAware.contentSpecificRouter.request");
gpii.express.tests.contentAware.contentSpecificRouter.request.handleRequest = function (that) {
    that.sendResponse(that.options.statusCode, that.options.body);
};

fluid.defaults("gpii.express.tests.contentAware.contentSpecificRouter.request", {
    gradeNames: ["gpii.express.requestAware", "autoInit"],
    invokers: {
        handleRequest: {
            funcName: "gpii.express.tests.contentAware.contentSpecificRouter.request.handleRequest",
            args:     ["{that}"]
        }
    }
});


fluid.defaults("gpii.express.tests.contentAware.contentSpecificRouter", {
    gradeNames:         ["gpii.express.requestAware.router", "autoInit"],
    requestAwareGrades: ["gpii.express.tests.contentAware.contentSpecificRouter.request"]
});

fluid.defaults("gpii.express.tests.contentAware.router", {
    gradeNames:         ["gpii.express.contentAware.router", "autoInit"],
    handlers: {
        "default": {
            contentType: "default",
            handler:     "{handleDefault}"
        },
        json: {
            contentType: "application/json",
            handler:     "{handleJson}"
        },
        text: {
            contentType: "text/html",
            handler:     "{handleText}"
        }
    },
    components: {
        handleDefault: {
            type: "gpii.express.tests.contentAware.contentSpecificRouter",
            options: {
                dynamicComponents: {
                    requestHandler: {
                        options: {
                            statusCode: 200,
                            body:       "This is the default response."
                        }
                    }
                }
            }
        },
        handleText: {
            type: "gpii.express.tests.contentAware.contentSpecificRouter",
            options: {
                dynamicComponents: {
                    requestHandler: {
                        options: {
                            statusCode: 200,
                            body:       "This is the text response."
                        }
                    }
                }
            }
        },
        handleJson: {
            type: "gpii.express.tests.contentAware.contentSpecificRouter",
            options: {
                dynamicComponents: {
                    requestHandler: {
                        options: {
                            statusCode: 200,
                            body:       "This is a JSON response."
                        }
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.express.tests.contentAware.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment", "autoInit"],
    port:   7533,
    baseUrl: "http://localhost:7533/",
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
                    router: {
                        type: "gpii.express.tests.contentAware.router",
                        options: {
                            path: "/"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.contentAware.caseHolder"
        }
    }
});

gpii.express.tests.contentAware.testEnvironment();
