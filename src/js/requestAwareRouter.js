// A router that will create a component for each request and hand off to that.  The component will have every one
// of the grades specified in `options.requestAwareGrades`.
//
// To use this in anger, at a minimum you need to supply `options.path` and `options.requestAwareGrade`.
//
// If you would like to pass in additional options to the `gpii.express.handler` grade, add an option like the following:
//
// `dynamicComponents: { requestHandler: { options: { custom: "value" } } }`
//
// Options that already exist when the router is created will be merged with the defaults as expected.  This approach
// will not work for dynamic values such as model or member variables.
//
// For dynamic values, you will need to use an IoC reference from within your `handler` grade's definition, as in:
//
// fluid.defaults("my.handler", {
//   gradeNames: ["gpii.express.handler", "autoInit"],
//   foo: "{gpii.express.requestAware.router}.foo
// }

"use strict";
var fluid     = fluid || require("infusion");
var gpii      = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.requestAware.router");

gpii.express.requestAware.router.getHandler = function (that) {
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
            type:          "gpii.express.handler",
            options: {
                request:    "{arguments}.0",
                response:   "{arguments}.1",
                timeout:    "{router}.options.timeout",
                gradeNames: "{router}.options.handlerGrades"
            }
        }

    },
    invokers: {
        "getHandler": {
            funcName: "gpii.express.requestAware.router.getHandler",
            args: ["{that}"]
        }
    }
});