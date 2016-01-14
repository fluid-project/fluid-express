/* Tests for the "express" and "router" module */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

var viewDir = fluid.module.resolvePath("%gpii-express/tests/views");

fluid.registerNamespace("gpii.express.tests.contentAware.handler");
gpii.express.tests.contentAware.handler.handleRequest = function (that) {
    that.sendResponse(that.options.statusCode, that.options.body);
};

fluid.defaults("gpii.express.tests.contentAware.handler", {
    gradeNames: ["gpii.express.handler"],
    statusCode: 200,
    invokers: {
        handleRequest: {
            funcName: "gpii.express.tests.contentAware.handler.handleRequest",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.tests.contentAware.defaultHandler", {
    gradeNames: ["gpii.express.tests.contentAware.handler"],
    body:       "This is the default response."
});

fluid.defaults("gpii.express.tests.contentAware.jsonHandler", {
    gradeNames: ["gpii.express.tests.contentAware.handler"],
    body:       "This is a JSON response."
});

fluid.defaults("gpii.express.tests.contentAware.textHandler", {
    gradeNames: ["gpii.express.tests.contentAware.handler"],
    body:       "This is the text response."
});

fluid.defaults("gpii.express.tests.contentAware.router", {
    gradeNames: ["gpii.express.contentAware.router"],
    handlers: {
        "default": {
            contentType:   "default",
            handlerGrades: ["gpii.express.tests.contentAware.defaultHandler"]
        },
        json: {
            contentType:  "application/json",
            handlerGrades: ["gpii.express.tests.contentAware.jsonHandler"]
        },
        text: {
            contentType:   "text/html",
            handlerGrades: ["gpii.express.tests.contentAware.textHandler"]
        }
    }
});

fluid.defaults("gpii.express.tests.contentAware.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    port:   6533,
    baseUrl: "http://localhost:6533/",
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
                        port:    "{testEnvironment}.options.port",
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
