// A router that will create an instance of `options.requestAwareGrade` for each request and hand off to that.
//
// To use this in anger, at a minimum you need to supply `options.path` and `options.requestAwareGrade`.

"use strict";
var fluid     = fluid || require("infusion");
var gpii      = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.requestAware.router");

gpii.express.requestAware.router.getRouter = function (that) {
    return function (req, res) {
        that.events.onRequest.fire(req, res);
    };
};

fluid.defaults("gpii.express.requestAware.router", {
    gradeNames: ["gpii.express.router", "autoInit"],
    timeout: 5000, // The default timeout we will pass to whatever grade we instantiate.
    method:     "get",
    events: {
        "onRequest": null
    },
    dynamicComponents: {
        requestHandler: {
            createOnEvent: "onRequest",
            type:          "{that}.options.requestAwareGrade",
            options: {
                request:  "{arguments}.0",
                response: "{arguments}.1",
                timeout:  "{that}.options.timeout"
            }
        }

    },
    invokers: {
        "getRouter": {
            funcName: "gpii.express.requestAware.router.getRouter",
            args: ["{that}"]
        }
    }
});