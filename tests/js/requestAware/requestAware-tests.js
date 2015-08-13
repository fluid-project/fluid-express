/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");

fluid.setLogging(true);

var path         = require("path");

require("./includes.js");

var viewDir    = path.resolve(__dirname, "./views");

fluid.registerNamespace("gpii.express.tests.requestAware.instrumented");
gpii.express.tests.requestAware.instrumented.handleRequest = function (that) {
    var instrumentedBody = "It's " + new Date() + " and I feel fine...";
    // Send the instrumented response using the standard function
    that.sendResponse(200, instrumentedBody);
};

fluid.defaults("gpii.express.tests.requestAware.instrumented", {
    gradeNames: ["gpii.express.handler", "autoInit"],
    invokers: {
        handleRequest: {
            funcName: "gpii.express.tests.requestAware.instrumented.handleRequest",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});

// Grade to simulate a delay in responding
fluid.registerNamespace("gpii.express.tests.requestAware.delayed");

// Static function to make sure we are called the right `setTimeout`
gpii.express.tests.requestAware.delayed.pretendToHandleRequest = function (that) {
    setTimeout(that.actuallyHandleRequest, 2500);
};

gpii.express.tests.requestAware.delayed.actuallyHandleRequest = function (that) {
    gpii.express.tests.requestAware.instrumented.handleRequest(that);
};

fluid.defaults("gpii.express.tests.requestAware.delayed", {
    gradeNames: ["gpii.express.tests.requestAware.instrumented", "autoInit"],
    invokers: {
        handleRequest: {
            funcName: "gpii.express.tests.requestAware.delayed.pretendToHandleRequest",
            args:     ["{that}"]
        },
        actuallyHandleRequest: {
            funcName: "gpii.express.tests.requestAware.delayed.actuallyHandleRequest",
            args:     ["{that}"]
        }
    }
});

// Grade to simulate a timeout (or the lack of a meaningful response).
fluid.defaults("gpii.express.tests.requestAware.timeout", {
    gradeNames: ["gpii.express.handler", "autoInit"],
    invokers: {
        handleRequest: {
            funcName: "fluid.identity" // Do nothing till you hear it from me, and you never will.
        }
    }
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
                    instrumented: {
                        type: "gpii.express.requestAware.router",
                        options: {
                            path:          "/instrumented",
                            handlerGrades: ["gpii.express.tests.requestAware.delayed"]
                        }
                    },
                    delayed: {
                        type: "gpii.express.requestAware.router",
                        options: {
                            path:          "/delayed",
                            handlerGrades: ["gpii.express.tests.requestAware.delayed"]
                        }
                    },
                    timeout: {
                        type: "gpii.express.requestAware.router",
                        options: {
                            path:          "/timeout",
                            handlerGrades: ["gpii.express.tests.requestAware.timeout"],
                            timeout:       2000
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
