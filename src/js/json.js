// Module to add body parsing to express.
"use strict";
var fluid  = fluid || require('infusion');
var gpii   = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.bodyparser.json");

var bp         = require("body-parser");

gpii.express.middleware.bodyparser.json.getMiddlewareFunction = function(that) {
    return bp.json();
};

fluid.defaults("gpii.express.middleware.bodyparser.json", {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    model: {
        middleware: ["urlencoded", "json"]
    },
    invokers: {
        "getMiddlewareFunction": {
            funcName: "gpii.express.middleware.bodyparser.json.getMiddlewareFunction",
            args: ["{that}"]
        }
    }
});