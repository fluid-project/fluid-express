/*

    Middleware that creates a `fluid.express.handler` component and uses that to process each request.  See the
    documentation for details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/requestAwareMiddleware.md

 */
"use strict";
var fluid = require("infusion");

require("./handler");

fluid.defaults("fluid.express.middleware.requestAware", {
    gradeNames: ["fluid.express.middleware", "fluid.express.handlerDispatcher"],
    invokers: {
        middleware: {
            func: "{that}.events.onRequest.fire",
            args: [{ gradeNames: "{that}.options.handlerGrades" }, "{arguments}.0", "{arguments}.1", "{arguments}.2"] // options, request, response, next
        }
    }
});
