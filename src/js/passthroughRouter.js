/*

     A `gpii.express.router` that does nothing itself, but which presumably has child router and middleware components
     that do things.  It is intended to be used to combine existing routers and middleware without writing new code.

     It can be used in any way you would use an intermediate router in express, for example to create a layer beneath
     which particular middleware is available.  To give a more concrete example, this router is used with the
     `schemaAware` middleware to pair input validation middleware with a gated router that is only allowed to do its
     work if the user input is valid according to a given JSON schema.  See the `gpii-json-schema` package for examples.

    If you use this grade, you should ensure that you have at least one child router which responds to the path `/`.
    Otherwise, requests addressed to the root of this router may never result in a response to the end user.

 */
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.router.passthrough");

gpii.express.router.passthrough.route = function (that, request, response, next) {
    that.options.router(request, response, next);
};

fluid.defaults("gpii.express.router.passthrough", {
    gradeNames: ["gpii.express.router"],
    method:     "use",
    invokers: {
        route: {
            funcName: "gpii.express.router.passthrough.route",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});