/*

    A default error handler that relays an upstream error to the user. See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/errorMiddleware.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.middleware.error");

/**
 *
 * @param that - The middleware component itself.
 * @param error - The raw upstream error.
 * @param request {Object} The Express {Request} object.
 * @param response {Object} The Express {Response} object.
 * @param next {Function} The next piece of middleware in the chain.  Only used if a response has already been sent (i.e. we have no way of contacting the user).
 *
 */
gpii.express.middleware.error.sendError = function (that, error, request, response, next) {
    if (response.headersSent) {
        return next(error);
    }

    var transformedError = fluid.model.transformWithRules({ that: that, error: error, request: request }, that.options.errorOutputRules);
    response.status(that.options.statusCode).send(transformedError);
};

// We must use this construct so that we always expose a function with the right signature, as Express determines
// that we are error middleware based on the method signature.
gpii.express.middleware.error.getWrappedMiddlewareErrorFunction = function (that) {
    return function wrappedErrorMiddleware(error, request, response, next) {
        that.middleware(error, request, response, next);
    };
};

fluid.defaults("gpii.express.middleware.error", {
    gradeNames: ["gpii.express.middleware"],
    statusCode: 500,
    method:     "use",
    mergePolicy: {
        "errorOutputRules": "nomerge"
    },
    errorOutputRules: {
        "": "error"
    },
    invokers: {
        "getMiddlewareFn": {
            funcName: "gpii.express.middleware.error.getWrappedMiddlewareErrorFunction",
            args: ["{that}"]
        },
        middleware: {
            funcName: "gpii.express.middleware.error.sendError",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // error, request, response, next
        }
    }
});

