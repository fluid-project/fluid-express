/* Tests for the `requestAware` modules. */
"use strict";
var fluid = require("infusion");

require("../includes.js");
require("./requestAware-caseholder");

fluid.registerNamespace("fluid.test.express.requestAware.instrumented");
fluid.test.express.requestAware.instrumented.handleRequest = function (that) {
    var instrumentedBody = "It's " + new Date() + " and I feel fine...";
    // Send the instrumented response using the standard function
    that.sendResponse(200, instrumentedBody);
};

fluid.defaults("fluid.test.express.requestAware.instrumented", {
    gradeNames: ["fluid.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "fluid.test.express.requestAware.instrumented.handleRequest",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});

// Grade to simulate a delay in responding
fluid.registerNamespace("fluid.test.express.requestAware.delayed");

// Static function to make sure we are called the right `setTimeout`
fluid.test.express.requestAware.delayed.pretendToHandleRequest = function (that) {
    setTimeout(that.actuallyHandleRequest, 2500);
};

fluid.test.express.requestAware.delayed.actuallyHandleRequest = function (that) {
    fluid.test.express.requestAware.instrumented.handleRequest(that);
};

fluid.defaults("fluid.test.express.requestAware.delayed", {
    gradeNames: ["fluid.test.express.requestAware.instrumented"],
    invokers: {
        handleRequest: {
            funcName: "fluid.test.express.requestAware.delayed.pretendToHandleRequest",
            args:     ["{that}"]
        },
        actuallyHandleRequest: {
            funcName: "fluid.test.express.requestAware.delayed.actuallyHandleRequest",
            args:     ["{that}"]
        }
    }
});

// Grade to simulate a timeout (or the lack of a meaningful response).
fluid.defaults("fluid.test.express.requestAware.timeout", {
    gradeNames: ["fluid.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "fluid.identity" // Do nothing till you hear it from me, and you never will.
        }
    }
});

fluid.defaults("fluid.test.express.requestAware.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7433,
    components: {
        express: {
            options: {
                components: {
                    instrumented: {
                        type: "fluid.express.middleware.requestAware",
                        options: {
                            path:          "/instrumented",
                            handlerGrades: ["fluid.test.express.requestAware.delayed"]
                        }
                    },
                    delayed: {
                        type: "fluid.express.middleware.requestAware",
                        options: {
                            path:          "/delayed",
                            handlerGrades: ["fluid.test.express.requestAware.delayed"]
                        }
                    },
                    timeout: {
                        type: "fluid.express.middleware.requestAware",
                        options: {
                            path:          "/timeout",
                            handlerGrades: ["fluid.test.express.requestAware.timeout"],
                            timeout:       2000
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.test.express.requestAware.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.test.express.requestAware.testEnvironment");
