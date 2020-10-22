/*

    The base grade for express middleware modules represented as Fluid components. See the documentation for details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/middleware.md

*/
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.express.middleware");


// We must use this construct so that we always expose a function with the right signature, as Express determines
// that we are a standard piece of middleware based on the method signature.
//
// It incorporates the previous mechanism for gating requests by method (get, post, put, use, etc.).
fluid.express.middleware.getWrappedMiddlewareFunction = function (that) {
    var wrappedFunction = function wrappedStandardMiddleware(request, response, next) {
        if (that.middleware) {
            that.middleware(request, response, next);
        }
        else {
            fluid.fail(that.options.messages.noMiddlewareFound);
        }
    };

    wrappedFunction.that = that;
    wrappedFunction.path = fluid.express.pathForComponent(that);
    return wrappedFunction;
};

fluid.defaults("fluid.express.middleware", {
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
            funcName: "fluid.express.middleware.getWrappedMiddlewareFunction",
            args: ["{that}"]
        }
    }
});
