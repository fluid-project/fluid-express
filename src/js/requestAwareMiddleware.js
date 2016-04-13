/*

    Middleware that creates a `gpii.express.handler` component and uses that to process each request.  See the
    documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/middleware.md

 */
"use strict";
var fluid = require("infusion");

fluid.defaults("gpii.express.middleware.requestAware", {
    gradeNames: ["gpii.express.middleware"],
    timeout: 5000, // The default timeout we will pass to whatever grade we instantiate.
    distributeOptions: [
        {
            source: "{that}.options.timeout",
            target: "{that gpii.express.handler}.options.timeout"
        },
        {
            source: "{that}.options.handlerGrades",
            target: "{that gpii.express.handler}.options.gradeNames"
        }
    ],
    method:     "get",
    events: {
        "onRequest": null
    },
    dynamicComponents: {
        requestHandler: {
            createOnEvent: "onRequest",
            type:          "gpii.express.handler",
            options: {
                request:    "{arguments}.0",
                response:   "{arguments}.1"
            }
        }
    },
    invokers: {
        middleware: {
            func: "{that}.events.onRequest.fire",
            args: ["{arguments}.0", "{arguments}.1"]
        }
    }
});