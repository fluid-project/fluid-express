/*

    A router that creates a `gpii.express.handler` component and uses that to process each request.  See the
    documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/middleware.md

 */
"use strict";
var fluid = require("infusion");

// A base grade to allow the dynamic request handling infrastructure to be used in things that are not routers
// (such as the `schemaMiddleware` grade in `gpii-json-schema`.
fluid.defaults("gpii.express.requestAware.base", {
    gradeNames: ["fluid.component"],
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
    }
});

// The normal router that most people will want to extend.
fluid.defaults("gpii.express.requestAware.router", {
    gradeNames: ["gpii.express.requestAware.base", "gpii.express.router"],
    invokers: {
        route: {
            func: "{that}.events.onRequest.fire",
            args: ["{arguments}.0", "{arguments}.1"]
        }
    }
});