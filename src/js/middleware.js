/*

    The base grade for express middleware modules represented as Fluid components. See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/middleware.md

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware");


// We must use this construct so that we always expose a function with the right signature, as Express determines
// that we are a standard piece of middleware based on the method signature.
// 
// It incorporates the previous mechanism for gating requests by method (get, post, put, use, etc.).
gpii.express.middleware.getWrappedMiddlewareFunction = function (that) {
    return function wrappedStandardMiddleware(request, response, next) {
        that.middleware(request, response, next);
    };
};

fluid.defaults("gpii.express.middleware", {
    gradeNames: ["fluid.component"],
    path:       "/",
    method:     "use",
    events: {
        onReady: {
            events: {
                onCreate: "onCreate"
            },
            args: ["{that}"]
        }
    },
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