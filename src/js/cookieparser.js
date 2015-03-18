// Module to add body parsing to express.
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.cookieparser");

var cp = require("cookie-parser");

gpii.express.middleware.cookieparser.getMiddleware = function () {
    return cp();
};

fluid.defaults("gpii.express.middleware.cookieparser", {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    invokers: {
        "getMiddleware": {
            funcName: "gpii.express.middleware.cookieparser.getMiddleware",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});