/*

    A `gpii.express.router` that does nothing itself, but which presumably has child router and middleware components
    that do things.  It is intended to be used to combine existing routers and middleware without writing new code.

    See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/router.md

 */
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.router.passthrough");

gpii.express.router.passthrough.route = function (that, request, response, next) {
    that.router(request, response, next);
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