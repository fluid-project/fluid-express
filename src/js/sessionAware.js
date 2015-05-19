// An abstract grade for "session aware" modules.  Modules that extend this grade are expected to be created dynamically,
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
fluid.registerNamespace("gpii.express.sessionAware");

gpii.express.sessionAware.checkRequirements = function (that) {
    if (!that.options) {
        fluid.fail("Cannot instantiate a 'sessionAware' component without the required options...");
    }

    if (!that.options.request) {
        fluid.fail("Cannot instantiate a 'sessionAware' component without a request object...");
    }

    if (!that.options.response) {
        fluid.fail("Cannot instantiate a 'sessionAware' component without a response object...");
    }
};

gpii.express.sessionAware.setTimeout = function (that) {
    setTimeout(that.sendTimeoutResponse, that.options.timeout);
};

gpii.express.sessionAware.sendTimeoutResponse = function (that) {
    that.sendResponse(500, { ok: false, message: "Session aware component timed out before it could respond sensibly." });
};

// Convenience function (with accompanying invoker) to ensure that the `afterResponseSent` event is fired.
gpii.express.sessionAware.sendResponse = function (that, statusCode, body) {
    if (!that.options.response) {
        fluid.fail("Cannot send response, I have no response object to work with...");
    }

    if (that.options.response.headersAlreadySent()) {
        fluid.fail("Cannot send response, headers have already been sent.");
    }

    that.options.response.status(statusCode).send(body);
    that.events.afterResponseSent.fire(that);
};

fluid.defaults("gpii.express.sessionAware", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    timeout: 5000, // All operations must be completed in `options.timeout` milliseconds, or we will send a timeout response and destroy ourselves.
    events: {
        afterResponseSent: null
    },
    listeners: {
        "onCreate.checkRequirements": {
            funcName: "gpii.express.sessionAware.checkRequirements",
            args:     ["{that}"]
        },
        "onCreate.setTimeout": {
            funcName: "gpii.express.sessionAware.setTimeout",
            args:     ["{that}"]
        },
        "afterResponseSent.destroy": {
            func: "{that}.destroy"
        }
    },
    invokers: {
        sendResponse: {
            funcName: "gpii.express.sessionAware.sendResponse",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        },
        sendTimeout: {
            funcName: "gpii.express.sessionAware.sendTimeout",
            args:     ["{that}"]
        }
    }
});