/*

  We provide some "helper" grades to assist other people in test routers and other components that run in conjunction
  with an instance of `gpii.express`.  These tests specifically exercise those test components.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes.js");
require("./helpers-caseholder");

fluid.defaults("gpii.express.tests.helpers.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    port:       7030,
    baseUrl:    "http://localhost:7030/",
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
                        views:   "%gpii-express/views",
                        session: {
                            secret: "Printer, printer take a hint-ter."
                        }
                    }
                },
                components: {
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.helpers.caseHolder"
        }
    }
});

gpii.express.tests.helpers.testEnvironment();
