"use strict";
// Base grade for express middleware modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into itself

var fluid = fluid || require("infusion");
fluid.registerNamespace("gpii.express.middleware");

fluid.defaults("gpii.express.middleware", {
    gradeNames: ["fluid.component"],
    invokers: {
        "getMiddleware": {
            "funcName": "fluid.notImplemented"
        }
    }
});