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
 * @param that {Object} - The middleware component itself.
 * @param req {Object} - The Express request object.
 * @param res {Object} - The Express response object.
 * @param next {Function} - The next piece of middleware in the chain.
 *
 * A function which confirm that this request matches our HTTP method.  If it does, our `middleware` invoker is called.
 * If not, the next piece of middleware in the chain is called immediately.
 *
 */
gpii.express.middleware.checkMethod = function (that, req, res, next) {
    if (that.options.method && !gpii.express.middleware.matchesMethod(req, that.options.method)) {
        next();
    }
    else {
        that.middleware(req, res, next);
    }
};

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
    return fluid.contains(fluid.makeArray(methods), req.method.toLowerCase());
};

fluid.defaults("gpii.express.middleware", {
    gradeNames: ["fluid.component"],
    invokers: {
        "middleware": {
            funcName: "fluid.notImplemented"
        },
        "checkMethod": {
            funcName: "gpii.express.middleware.checkMethod",
            args:       ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]

        }
    }
});