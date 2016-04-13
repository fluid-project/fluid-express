/* Tests for the `requestAware` modules. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes.js");
require("./requestAware-caseholder");

fluid.registerNamespace("gpii.tests.express.requestAware.instrumented");
gpii.tests.express.requestAware.instrumented.handleRequest = function (that) {
    var instrumentedBody = "It's " + new Date() + " and I feel fine...";
    // Send the instrumented response using the standard function
    that.sendResponse(200, instrumentedBody);
};

fluid.defaults("gpii.tests.express.requestAware.instrumented", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "gpii.tests.express.requestAware.instrumented.handleRequest",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});

// Grade to simulate a delay in responding
fluid.registerNamespace("gpii.tests.express.requestAware.delayed");

// Static function to make sure we are called the right `setTimeout`
gpii.tests.express.requestAware.delayed.pretendToHandleRequest = function (that) {
    setTimeout(that.actuallyHandleRequest, 2500);
};

gpii.tests.express.requestAware.delayed.actuallyHandleRequest = function (that) {
    gpii.tests.express.requestAware.instrumented.handleRequest(that);
};

fluid.defaults("gpii.tests.express.requestAware.delayed", {
    gradeNames: ["gpii.tests.express.requestAware.instrumented"],
    invokers: {
        handleRequest: {
            funcName: "gpii.tests.express.requestAware.delayed.pretendToHandleRequest",
            args:     ["{that}"]
        },
        actuallyHandleRequest: {
            funcName: "gpii.tests.express.requestAware.delayed.actuallyHandleRequest",
            args:     ["{that}"]
        }
    }
});

// Grade to simulate a timeout (or the lack of a meaningful response).
fluid.defaults("gpii.tests.express.requestAware.timeout", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "fluid.identity" // Do nothing till you hear it from me, and you never will.
        }
    }
});

fluid.defaults("gpii.tests.express.requestAware.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
    port:   7433,
    components: {
        express: {
            options: {
                components: {
                    instrumented: {
                        type: "gpii.express.middleware.requestAware",
                        options: {
                            path:          "/instrumented",
                            handlerGrades: ["gpii.tests.express.requestAware.delayed"]
                        }
                    },
                    delayed: {
                        type: "gpii.express.middleware.requestAware",
                        options: {
                            path:          "/delayed",
                            handlerGrades: ["gpii.tests.express.requestAware.delayed"]
                        }
                    },
                    timeout: {
                        type: "gpii.express.middleware.requestAware",
                        options: {
                            path:          "/timeout",
                            handlerGrades: ["gpii.tests.express.requestAware.timeout"],
                            timeout:       2000
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.requestAware.caseHolder"
        }
    }
});

gpii.tests.express.requestAware.testEnvironment();
