/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");

fluid.setLogging(true);

var path         = require("path");

require("./includes.js");

var viewDir    = path.resolve(__dirname, "./views");

fluid.registerNamespace("gpii.express.tests.requestAware.instrumented");
gpii.express.tests.requestAware.instrumented.recordTime = function (that) {
    that.time = new Date();
};

gpii.express.tests.requestAware.instrumented.sendInstrumentedResponse = function (that, statusCode, body) {
    var instrumentedBody = fluid.copy(body);
    instrumentedBody.time = that.time;
    instrumentedBody.action = that.request.query.action;

    // Send the instrumented response using the standard function
    gpii.express.requestAware.sendResponse(that, statusCode, instrumentedBody);
};

fluid.defaults("gpii.express.tests.requestAware.instrumented", {
    gradeNames: ["gpii.express.requestAware", "autoInit"],
    members: {
        time: null
    },
    listeners: {
        "onCreate.recordTime": {
            funcName: "gpii.express.tests.requestAware.instrumented.recordTime",
            args:     ["{that}"]
        }
    },
    invokers: {
        sendResponse: {
            funcName: "gpii.express.tests.requestAware.instrumented.sendInstrumentedResponse",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});

// Grade to simulate a delay in responding
fluid.registerNamespace("gpii.express.tests.requestAware.delayed");

// Static function to make sure we are called the right `setTimeout`
gpii.express.tests.requestAware.delayed.setTimeout = function (callback, milliseconds) {
    setTimeout(callback, milliseconds);
};

fluid.defaults("gpii.express.tests.requestAware.delayed", {
    gradeNames: ["gpii.express.tests.requestAware.instrumented", "autoInit"],
    listeners: {
        "onCreate.pauseAndFire": {
            funcName: "gpii.express.tests.requestAware.delayed.setTimeout",
            args: ["{that}.sendDelayedResponse", 2500 ]
        }
    },
    invokers: {
        sendDelayedResponse: {
            func: "{that}.sendResponse",
            args: [200, {ok: true, message: "I'm OK now."}]
        }
    }
});

// Grade to simulate a timeout (or the lack of a meaningful response).
fluid.registerNamespace("gpii.express.tests.requestAware.timeout");
fluid.defaults("gpii.express.tests.requestAware.timeout", {
    gradeNames: ["gpii.express.tests.requestAware.instrumented", "autoInit"]
});

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
                    delayed: {
                        type:              "gpii.express.requestAware.router",
                        options: {
                            path:              "/delayed",
                            requestAwareGrades: ["gpii.express.tests.requestAware.delayed"]
                        }
                    },
                    timeout: {
                        type:              "gpii.express.requestAware.router",
                        options: {
                            path:               "/timeout",
                            requestAwareGrades: ["gpii.express.tests.requestAware.timeout"],
                            timeout:            2500
                        }
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
