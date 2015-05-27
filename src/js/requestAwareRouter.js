// A router that will create a component for each request and hand off to that.  The component will have every one
// of the grades specified in `options.requestAwareGrades`.
//
// To use this in anger, at a minimum you need to supply `options.path` and `options.requestAwareGrade`.
//
// If you would like to pass in additional options to the requestAware grade, add an option like the following:
//
// `dynamicComponents: { requestHandler: { custom: "value" } }`
//
// Those options will be merged with the defaults as expected.

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
            type:          "gpii.express.requestAware",
            options: {
                request:    "{arguments}.0",
                response:   "{arguments}.1",
                timeout:    "{router}.options.timeout",
                gradeNames: "{router}.options.requestAwareGrades"
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