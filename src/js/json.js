// Module to add body parsing to express.
"use strict";
var fluid  = fluid || require("infusion");
var gpii   = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.bodyparser.json");

var bp = require("body-parser");

gpii.express.middleware.bodyparser.json.init = function (that) {
    that.json = bp.json();
};

gpii.express.middleware.bodyparser.json.middleware = function (that, req, res, next) {
    that.json(req, res, next);
};

fluid.defaults("gpii.express.middleware.bodyparser.json", {
    gradeNames: ["gpii.express.middleware"],
    invokers: {
        "middleware": {
            funcName: "gpii.express.middleware.bodyparser.json.middleware",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.middleware.bodyparser.json.init",
            args:     ["{that}"]
        }
    }
});