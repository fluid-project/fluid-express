// Sample router module to test the `gpii.express.requestAware` abstract grade.
//
// It is only meant for testing purposes and should not be extended.  It accepts a single parameter, `req.query.action`,
// and executes various scenarios based on that action.
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.tests.requestAware.request");
gpii.express.tests.requestAware.request.recordTime = function (that) {
    that.time = new Date();
};

gpii.express.tests.requestAware.request.sendInstrumentedResponse = function (that, statusCode, body) {
    var instrumentedBody = fluid.copy(body);
    instrumentedBody.time = that.time;
    instrumentedBody.action = that.request.query.action;

    // Send the instrumented response using the standard function
    gpii.express.requestAware.sendResponse(that, statusCode, instrumentedBody);
};

fluid.defaults("gpii.express.tests.requestAware.request", {
    gradeNames: ["gpii.express.requestAware", "autoInit"],
    members: {
        time: null
    },
    listeners: {
        "onCreate.recordTime": {
            funcName: "gpii.express.tests.requestAware.request.recordTime",
            args:     ["{that}"]
        }
    },
    invokers: {
        sendResponse: {
            funcName: "gpii.express.tests.requestAware.request.sendInstrumentedResponse",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});

fluid.registerNamespace("gpii.express.tests.requestAware.router");
gpii.express.tests.requestAware.router.getRouter = function (that) {
    return function (req, res) {
        if (!req.query) {
            fluid.fail("Can't continue without the req.query object created by query parsing middleware.");
        }

        // Simulate a timeout
        if (req.query.action === "timeout") {
            that.events.onNewTimeoutRequest.fire(req, res);
        }
        // Simulate an upstream request and respond when the time is right.
        else {
            that.events.onNewDelayedRequest.fire(req, res);
        }
    };
};

fluid.defaults("gpii.express.tests.requestAware.router", {
    gradeNames: ["gpii.express.router", "autoInit"],
    method:     "get",
    path:       "/requestAware",
    events: {
        "onNewDelayedRequest": null,
        "onNewTimeoutRequest": null
    },
    components: {
        urlencoded: {
            type: "gpii.express.middleware.bodyparser.urlencoded"
        }
    },
    dynamicComponents: {
        delayedResponse: {
            createOnEvent: "onNewDelayedRequest",
            type:          "gpii.express.tests.requestAware.request",
            options: {
                request:  "{arguments}.0",
                response: "{arguments}.1",
                listeners: {
                    "onCreate.pauseAndFire": {
                        funcName: "setTimeout",
                        args: ["{that}.sendDelayedResponse", 2500 ]
                    }
                },
                invokers: {
                    sendDelayedResponse: {
                        func: "{that}.sendResponse",
                        args: [ 200, { ok: true, message: "I'm OK now." } ]
                    }
                }
            }
        },
        timeoutResponse: {
            createOnEvent: "onNewTimeoutRequest",
            type:          "gpii.express.tests.requestAware.request",
            options: {
                request:  "{arguments}.0",
                response: "{arguments}.1",
                timeout:  2500  // This has to be less than 5 seconds or our test harness itself will step in.
            }
        }

    },
    invokers: {
        "getRouter": {
            funcName: "gpii.express.tests.requestAware.router.getRouter",
            args: ["{that}"]
        }
    }
});