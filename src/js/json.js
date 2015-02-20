// Module to help express understand JSON data.
"use strict";
var fluid  = fluid || require('infusion');
var gpii   = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.bodyparser.json");

var bp         = require("body-parser");

gpii.express.middleware.bodyparser.json.getJsonMiddlewareFunction = function(that) {
    return bp.json();
};

fluid.defaults("gpii.express.middleware.bodyparser", {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    invokers: {
        "getMiddlewareFunction": {
            funcName: "gpii.express.middleware.bodyparser.json.getJsonMiddlewareFunction",
            "args": [ "{that}"]
        }
    }
});