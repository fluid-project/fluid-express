"use strict";
// Base grade for express middleware modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into itself

var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware");

gpii.express.middleware.complainAboutMissingFunction = function(){
    throw(new Error("You must implement your own getMiddlewareFunction invoker."));
};

fluid.defaults("gpii.express.middleware", {
    gradeNames: ["fluid.eventedComponent", "fluid.modelRelayComponent", "autoInit"],
    config:     "{gpii.express}.options.config",
    invokers: {
        "getMiddlewareFunction": {
            "funcName": "gpii.express.middleware.complainAboutMissingFunction",
            "args":     ["{that}"]
        }
    }
});