/*

    Middleware that creates a `gpii.express.handler` component and uses that to process each request.  See the
    documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/requestAwareMiddleware.md

 */
"use strict";
var fluid = require("infusion");

require("./handler");

fluid.defaults("gpii.express.middleware.requestAware", {
    gradeNames: ["gpii.express.middleware", "gpii.express.handlerDispatcher"],
    invokers: {
        middleware: {
            func: "{that}.events.onRequest.fire",
            args: [{ gradeNames: "{that}.options.handlerGrades" }, "{arguments}.0", "{arguments}.1", "{arguments}.2"] // options, request, response, next
        }
    }
});