// Module to add body parsing to express.
"use strict";
var fluid  = fluid || require('infusion');
var gpii   = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.bodyparser");

var bp         = require("body-parser");

gpii.express.middleware.bodyparser.json = function(that, req, res, next) {
    if (!that.privateJson) {
        that.privateJson       = bp.json();
    }

    that.privateJson(req, res, next);
};

gpii.express.middleware.bodyparser.urlencoded = function(that, req, res, next) {
    if (!that.privateUrlencoded) {
        that.privateUrlencoded = bp.urlencoded({ extended: false });
    }

    that.privateUrlencoded(req, res, next);
};

fluid.defaults("gpii.express.middleware.bodyparser", {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    model: {
        middleware: ["urlencoded", "json"]
    },
    invokers: {
        "json": {
            funcName: "gpii.express.middleware.bodyparser.json",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        },
        "urlencoded": {
            funcName: "gpii.express.middleware.bodyparser.urlencoded",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});