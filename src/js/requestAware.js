// An abstract grade for "request aware" modules.  Modules that extend this grade are expected to be created dynamically,
// as outlined here:
//
// http://docs.fluidproject.org/infusion/development/SubcomponentDeclaration.html#dynamic-subcomponents-with-a-source-event
//
// Typically, a gpii.express.router module would be constructing one of these components per request.  For more examples,
// check out the tests.
//
// This module expects to be passed two things when it is constructed:
// 1. The express request object.
// 2. The express response object.
//
// By default this object is created with a built-in timeout, and will respond with a timeout if nothing else occurs.
// A typical use case in extending this module would be to perform server-side I/O and then respond with the results.
// Your response must fire an `afterResponseSent` event to avoid the timeout firing.
//
// For an example of how this can be used, check out the tests included with this package.

"use strict";
var fluid     = fluid || require("infusion");
var gpii      = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.requestAware");

gpii.express.requestAware.checkRequirements = function (that) {
    if (!that.options) {
        fluid.fail("Cannot instantiate a 'requestAware' component without the required options...");
    }

    if (!that.options.request) {
        fluid.fail("Cannot instantiate a 'requestAware' component without a request object...");
    }

    if (!that.options.response) {
        fluid.fail("Cannot instantiate a 'requestAware' component without a response object...");
    }
};

gpii.express.requestAware.setTimeout = function (that) {
    setTimeout(that.sendTimeoutResponse, that.options.timeout);
};

gpii.express.requestAware.sendTimeoutResponse = function (that) {
    that.sendResponse(500, { ok: false, message: "Session aware component timed out before it could respond sensibly." });
};

// Convenience function (with accompanying invoker) to ensure that the `afterResponseSent` event is fired.
gpii.express.requestAware.sendResponse = function (that, statusCode, body) {
    if (!that.response) {
        fluid.fail("Cannot send response, I have no response object to work with...");
    }

    that.response.status(statusCode).send(body);
    that.events.afterResponseSent.fire(that);
};

fluid.defaults("gpii.express.requestAware", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    timeout: 5000, // All operations must be completed in `options.timeout` milliseconds, or we will send a timeout response and destroy ourselves.
    mergePolicy: {
        "request":  "nomerge",
        "response": "nomerge"
    },
    members: {
        "request":  "{that}.options.request",
        "response": "{that}.options.response"
    },
    events: {
        afterResponseSent: null
    },
    listeners: {
        "onCreate.checkRequirements": {
            funcName: "gpii.express.requestAware.checkRequirements",
            args:     ["{that}"]
        },
        "onCreate.setTimeout": {
            funcName: "gpii.express.requestAware.setTimeout",
            args:     ["{that}"]
        },
        "afterResponseSent.destroy": {
            func: "{that}.destroy"
        }
    },
    invokers: {
        sendResponse: {
            funcName: "gpii.express.requestAware.sendResponse",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        },
        sendTimeoutResponse: {
            funcName: "gpii.express.requestAware.sendTimeoutResponse",
            args:     ["{that}"]
        }
    }
});