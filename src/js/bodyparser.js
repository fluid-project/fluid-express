// Module to add body parsing to express.
"use strict";
var namespace  = "gpii.express.middleware.bodyparser";
var fluid      = fluid || require('infusion');
var gpii       = fluid.registerNamespace("gpii");
var bodyParser = fluid.registerNamespace(namespace);
var bp         = require("body-parser");

bodyParser.json = function(that, req, res, next) {
    if (!that.privateJson) {
        that.privateJson       = bp.json();
    }

    that.privateJson(req, res, next);
};

bodyParser.urlencoded = function(that, req, res, next) {
    if (!that.privateUrlencoded) {
        that.privateUrlencoded = bp.urlencoded({ extended: false });
    }

    that.privateUrlencoded(req, res, next);
};

fluid.defaults(namespace, {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    model: {
        middleware: ["urlencoded", "json"]
    },
    invokers: {
        "json": {
            funcName: namespace + ".json",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        },
        "urlencoded": {
            funcName: namespace + ".urlencoded",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});