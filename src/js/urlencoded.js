// Module to help express understand URL-encoded data.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.bodyparser.urlencoded");

var bp = require("body-parser");

gpii.express.middleware.bodyparser.urlencoded.init = function (that) {
    that.urlencoded = bp.urlencoded({ extended: false });
};

gpii.express.middleware.bodyparser.urlencoded.middleware = function (that, req, res, next) {
    that.urlencoded(req, res, next);
};

fluid.defaults("gpii.express.middleware.bodyparser.urlencoded", {
    gradeNames: ["fluid.modelComponent", "gpii.express.middleware"],
    invokers: {
        "middleware": {
            funcName: "gpii.express.middleware.bodyparser.urlencoded.middleware",
            args:     [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2" ]
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.middleware.bodyparser.urlencoded.init",
            args:     ["{that}"]
        }
    }
});