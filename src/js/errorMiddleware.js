/*

    A default error handler that relays an upstream error to the user. See the documentation for details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/errorMiddleware.md

 */
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.express.middleware.error");

/**
 *
 * @param {Object} that - The middleware component itself.
 * @param {Any} error - The raw upstream error.
 * @param {Object} request - The Express {Request} request - object.
 * @param {Object} response - The Express {Response} response - object.
 * @param {Function} next - The next piece of middleware in the chain.  Only used if a response has already been sent (i.e. we have no way of contacting the user).
 *
 */
fluid.express.middleware.error.sendError = function (that, error, request, response, next) {
    if (response.headersSent) {
        // Pass along the raw error so that downstream error-handling middleware that does not need to send a response
        // (for example, an audit logger) will still have a chance to do its work.
        next(error);

        fluid.fail("An error ocurred after the response was already sent!:", error);
    }
    else {
        var transformedError = fluid.model.transformWithRules({ that: that, error: error, request: request }, that.options.errorOutputRules);
        var statusCode = error.statusCode || that.options.defaultStatusCode;
        response.status(statusCode).send(transformedError);
    }
};

// We must use this construct so that we always expose a function with the right signature, as Express determines
// that we are error middleware based on the method signature.
fluid.express.middleware.error.getWrappedMiddlewareErrorFunction = function (that) {
    var wrappedFunction = function wrappedErrorMiddleware(error, request, response, next) {
        that.middleware(error, request, response, next);
    };

    wrappedFunction.that = that;
    wrappedFunction.path = fluid.express.pathForComponent(that);
    return wrappedFunction;
};

fluid.defaults("fluid.express.middleware.error", {
    gradeNames:        ["fluid.express.middleware"],
    defaultStatusCode: 500,
    method:            "use",
    mergePolicy: {
        "errorOutputRules": "nomerge"
    },
    errorOutputRules: {
        "": "error"
    },
    invokers: {
        "getMiddlewareFn": {
            funcName: "fluid.express.middleware.error.getWrappedMiddlewareErrorFunction",
            args: ["{that}"]
        },
        middleware: {
            funcName: "fluid.express.middleware.error.sendError",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // error, request, response, next
        }
    }
});
