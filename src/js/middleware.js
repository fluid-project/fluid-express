"use strict";
// This is the base grade for express middleware modules represented as Fluid components.
//
// An instance of `gpii.express` or `gpii.express.router` will automatically attempt to wire in anything with this
// grade name into itself.
//
// You are expected to define a `middleware` invoker.  That function is passed an express `request` object, a
// `response` object, and the `next` function in the chain of middlware and routers.
//
// An invoker definition might look something like:
//
// invokers: {
//   middleware: {
//     funcName: "your.namespaced.function",
//     args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
//   }
// }
//
// Note that express itself does not limit the operation of middleware to a particular method. So, all middleware that
// matches the supplied path will be executed.  See https://github.com/strongloop/express/issues/2760 for details.
//
// To avoid this behavior, set `options.method` to the method (string) or methods (array of strings) you're working
// with.  Before passing on the request to your middleware implementation, the request method will be checked.  If the
// method matches `options.method`, the `middleware` invoker will be executed.  If not, the supplied `next` method will
// be executed and your middleware's logic will be bypassed.
//
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware");

gpii.express.middleware.checkMethod = function (that, req, res, next) {
    if (that.options.method && gpii.express.middleware.matchesMethod(req, that.options.method)) {
        that.middleware(req, res, next);
    }
    else {
        next();
    }
};

gpii.express.middleware.matchesMethod = function (req, methods) {
    var methodArray = fluid.makeArray(methods);
    var matches = false;

    fluid.each(methodArray, function (methodAllowedByComponent) {
        if (!matches) {
            var requestMethod = req.method.toLowerCase();
            if (methodAllowedByComponent === requestMethod) {
                matches = true;
            }
        }
    });

        return matches;
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