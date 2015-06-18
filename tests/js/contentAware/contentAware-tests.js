/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");

fluid.setLogging(true);

var path         = require("path");

require("./includes.js");

var viewDir    = path.resolve(__dirname, "./views");


fluid.registerNamespace("gpii.express.tests.contentAware.request");

fluid.defaults("gpii.express.tests.contentAware.request", {
    gradeNames: ["gpii.express.contentAware.request"],
    messages: {
        "default": "default",
        json:      "json",
        text:      "text"
    },
    handlers: {
        "default": {
            contentType: "default",
            handler:     "{that}.handleDefault"
        },
        json: {
            contentType: "application/json",
            handler:     "{that}.handleJson"
        },
        text: {
            contentType: "text/html",
            handler:     "{that}.handleText"
        }
    },
    invokers: {
        handleDefault: {
            funcName: "gpii.express.requestAware.sendResponse",
            args:     ["{that}", 200, "{that}.options.messages.default"]
        },
        handleText: {
            funcName: "gpii.express.requestAware.sendResponse",
            args:     ["{that}", 200, "{that}.options.messages.text"]
        },
        handleJson: {
            funcName: "gpii.express.requestAware.sendResponse",
            args:     ["{that}", 200, "{that}.options.messages.json"]
        }
    }
});


fluid.defaults("gpii.express.tests.contentAware.router", {
    gradeNames:         ["gpii.express.contentAware.router", "autoInit"],
    requestAwareGrades: ["gpii.express.tests.contentAware.request"]
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
