/*

    The base grade for express middleware modules represented as Fluid components. See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/middleware.md

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware");

/**
 *
 * @param req {Object} - The Express request object.
 * @param methods {Array} - The list of accepted methods.
 * @returns {Boolean} `true` if the request matches our accepted methods, `false` if it does not.
 *
 * Check the method of the request to confirm whether we should handle it (see above).
 *
 */
gpii.express.middleware.matchesMethod = function (req, methods) {
    var methodArray = fluid.makeArray(methods);
    return fluid.contains(methodArray, req.method.toLowerCase()) || fluid.contains(methodArray, "use");
};

// We must use this construct so that we always expose a function with the right signature, as Express determines
// that we are a standard piece of middleware based on the method signature.
// 
// It incorporates the previous mechanism for gating requests by method (get, post, put, use, etc.).
gpii.express.middleware.getWrappedMiddlewareFunction = function (that) {
    return function wrappedStandardMiddleware(request, response, next) {
        if (that.options.method && !gpii.express.middleware.matchesMethod(request, that.options.method)) {
            next();
        }
        else {
            that.middleware(request, response, next);
        }
    };
};

fluid.defaults("gpii.express.middleware", {
    gradeNames: ["fluid.component"],
    invokers: {
        "getMiddlewareFn": {
            funcName: "gpii.express.middleware.getWrappedMiddlewareFunction",
            args: ["{that}"]
        },
        "middleware": {
            funcName: "fluid.notImplemented"
        }
    }
});