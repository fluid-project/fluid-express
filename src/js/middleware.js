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
        if (that.middleware) {
            that.middleware(request, response, next);
        }
        else {
            fluid.fail(that.options.messages.noMiddlewareFound);
        }
    };
};

fluid.defaults("gpii.express.middleware", {
    gradeNames: ["fluid.component"],
    path:       "/",
    method:     "use",
    messages: {
        noMiddlewareFound: "Your middleware grade must have a `middleware` invoker or member."
    },
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
        }
    }
});