/*

    An abstract grade for "request handler" modules, which respond to individual requests sent to `requestAware` or
    `contentAware` middleware.  See the documentation for more details:

    https://github.com/fluid-project/fluid-express/blob/master/docs/handler.md

 */
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.express.handler");

/**
 *
 * Check that all our requirements are met before doing any actual work.
 *
 * @param {Object} that - the handler component itself.
 *
 */
fluid.express.handler.checkRequirements = function (that) {
    fluid.each(["request", "response", "next"], function (requiredField) {
        if (!that.options[requiredField]) {
            fluid.fail("Cannot instantiate a 'handler' component without a '" + requiredField + "' object...");
        }
    });
};

/**
 *
 * Put a timeout mechanism in place that will send a stock response if the handler does not complete its work in time.
 *
 * @param {Object} that - the handler component itself.
 *
 */
fluid.express.handler.setTimeout = function (that) {
    that.timeout = setTimeout(that.sendTimeoutResponse, that.options.timeout);
};

/**
 *
 * Clear the timeout mechanism once a response has been sent.
 *
 * @param {Object} that - the handler component itself.
 *
 */
fluid.express.handler.clearTimeout = function (that) {
    if (that.timeout) {
        clearTimeout(that.timeout);
    }
};

/**
 *
 * Send a canned response if no one else has responded in `options.timeout` milliseconds.
 *
 * @param {Object} that - the handler component itself.
 *
 */
fluid.express.handler.sendTimeoutResponse = function (that) {
    that.sendError(500, { message: that.options.messages.timedOut });
};

/**
 *
 * Send a response using `that.options.response`.  Commonly accessed using `{that}.sendResponse`.
 *
 * @param {Object} that - the handler component itself.
 * @param {Object} response - The Express `request` object.
 * @param {Number} statusCode - The status code for the response.
 * @param {Object} body - The payload to send.
 */
fluid.express.handler.sendResponse = function (that, response, statusCode, body) {
    if (!response) {
        fluid.fail("Cannot send response, I have no response object to work with...");
    }

    response.status(statusCode).send(body);
};


/**
 *
 * Wrap a raw error based on the rules found in `that.options.rules.sendError` and pass it along to downstream
 * middleware using `that.options.next`.
 *
 * @param {Object} that - the handler component itself.
 * @param {Number} statusCode - The status code for the response.
 * @param {Object} body - The payload to send.
 */
fluid.express.handler.sendError = function (that, statusCode, body) {
    var transformedError = fluid.model.transformWithRules({ statusCode: statusCode, body: body}, that.options.rules.sendError);
    that.options.next(transformedError);
};

/**
 *
 * Add a listener to the native response object's `finish` listener that triggers our own `afterResponseSent` event.
 *
 * @param {Object} that - the handler component itself.
 *
 */
fluid.express.handler.addResponseListener = function (that) {
    that.options.response.once("finish", that.events.afterResponseSent.fire);
};

fluid.defaults("fluid.express.handler", {
    gradeNames: ["fluid.component"],
    timeout:    5000, // All operations must be completed in `options.timeout` milliseconds, or we will send a timeout response and destroy ourselves.
    events: {
        afterResponseSent: null
    },
    mergePolicy: {
        "request":  "nomerge",
        "response": "nomerge"
    },
    request:  "{arguments}.1",
    response: "{arguments}.2",
    next:     "{arguments}.3",
    messages: {
        timedOut: "Request aware component timed out before it could respond sensibly."
    },
    members: {
        timeout:  null
    },
    rules: {
        sendError: {
            isError:    { literalValue: true},
            statusCode: "statusCode",
            "":         "body"
        }
    },
    listeners: {
        "onCreate.checkRequirements": {
            funcName: "fluid.express.handler.checkRequirements",
            args:     ["{that}"]
        },
        "onCreate.addResponseListener": {
            funcName: "fluid.express.handler.addResponseListener",
            args:     ["{that}"]
        },
        "onCreate.setTimeout": {
            funcName: "fluid.express.handler.setTimeout",
            args:     ["{that}"]
        },
        "onCreate.handleRequest": {
            func: "{that}.handleRequest"
        },
        "afterResponseSent.destroy": {
            func: "{that}.destroy"
        },
        "onDestroy.clearTimeout": {
            funcName: "fluid.express.handler.clearTimeout",
            args:     ["{that}"]
        }
    },
    invokers: {
        sendResponse: {
            funcName: "fluid.express.handler.sendResponse",
            args:     ["{that}", "{that}.options.response", "{arguments}.0", "{arguments}.1"] // statusCode, body
        },
        sendError: {
            funcName: "fluid.express.handler.sendError",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"] // statusCode, body
        },
        sendTimeoutResponse: {
            funcName: "fluid.express.handler.sendTimeoutResponse",
            args:     ["{that}"]
        },
        handleRequest: {
            funcName: "fluid.notImplemented"
        }
    }
});

// The base grade for things like the "request aware" and "content aware" grades that dispatch individual requests to
// a `fluid.express.handler`.
fluid.defaults("fluid.express.handlerDispatcher", {
    gradeNames: ["fluid.component"],
    timeout: 5000, // The default timeout we will pass to whatever grade we instantiate.
    events: {
        onRequest: null
    },
    distributeOptions: [{
        source: "{that}.options.timeout",
        target: "{that > fluid.express.handler}.options.timeout"
    }],
    dynamicComponents: {
        requestHandler: {
            createOnEvent: "onRequest",
            type:          "fluid.express.handler",
            options:       "{arguments}.0"
        }
    }
});
