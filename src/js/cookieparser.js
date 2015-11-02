// Module to add body parsing to express.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.cookieparser");

var cp = require("cookie-parser");

gpii.express.middleware.cookieparser.init = function (that) {
    that.cp = cp();
};

gpii.express.middleware.cookieparser.middleware = function (that, req, res, next) {
    that.cp(req, res, next);
};

fluid.defaults("gpii.express.middleware.cookieparser", {
    gradeNames: ["fluid.modelComponent", "gpii.express.middleware"],
    invokers: {
        "middleware": {
            funcName: "gpii.express.middleware.cookieparser.middleware",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.middleware.cookieparser.init",
            args:     ["{that}"]
        }
    }
});