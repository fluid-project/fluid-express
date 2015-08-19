"use strict";
// Base grade for express middleware modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into itself

var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware");

gpii.express.middleware.complainAboutMissingFunction = function () {
    fluid.fail("You must implement your own getMiddleware invoker.");
};

fluid.defaults("gpii.express.middleware", {
    gradeNames: ["fluid.component"],
    invokers: {
        "getMiddleware": {
            "funcName": "gpii.express.middleware.complainAboutMissingFunction",
            "args":     ["{that}"]
        }
    }
});