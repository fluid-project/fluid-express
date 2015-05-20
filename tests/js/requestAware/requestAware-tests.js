/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");

fluid.setLogging(true);

var path         = require("path");

require("./includes.js");

var viewDir    = path.resolve(__dirname, "./views");

fluid.defaults("gpii.express.tests.requestAware.testEnvironment", {
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
                    requestAwareRouter: {
                        type: "gpii.express.tests.requestAware.router"
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.requestAware.caseHolder"
        }
    }
});

gpii.express.tests.requestAware.testEnvironment();
