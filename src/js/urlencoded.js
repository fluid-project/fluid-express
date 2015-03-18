// Module to help express understand URL-encoded data.
"use strict";
var fluid  = fluid || require("infusion");
var gpii   = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.bodyparser.urlencoded");

var bp = require("body-parser");

gpii.express.middleware.bodyparser.urlencoded.getMiddleware = function () {
    return bp.urlencoded({ extended: false });
};

fluid.defaults("gpii.express.middleware.bodyparser.urlencoded", {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    invokers: {
        "getMiddleware": {
            funcName: "gpii.express.middleware.bodyparser.urlencoded.getMiddleware",
            "args": [ "{that}" ]
        }
    }
});