/* Tests for the `requestAware` modules. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes.js");
require("./requestAware-caseholder");

fluid.registerNamespace("gpii.express.tests.requestAware.instrumented");
gpii.express.tests.requestAware.instrumented.handleRequest = function (that) {
    var instrumentedBody = "It's " + new Date() + " and I feel fine...";
    // Send the instrumented response using the standard function
    that.sendResponse(200, instrumentedBody);
};

fluid.defaults("gpii.express.tests.requestAware.instrumented", {
    gradeNames: ["gpii.express.handler"],
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
    gradeNames: ["gpii.express.tests.requestAware.instrumented"],
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
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "fluid.identity" // Do nothing till you hear it from me, and you never will.
        }
    }
});

fluid.defaults("gpii.express.tests.requestAware.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:   7433,
    components: {
        express: {
            options: {
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
