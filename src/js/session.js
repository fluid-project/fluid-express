// Module to add session handling to express.
"use strict";
var fluid     = fluid || require("infusion");
var gpii      = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.session");

require("./configholder");

gpii.express.middleware.session.init = function (that) {
    var session   = require("express-session");
    var options = {
        secret:            that.options.config.express.session.secret,
        resave:            that.options.config.express.session.resave ? true : false,
        saveUninitialized: that.options.config.express.session.saveUninitialized ? true: false
    };
    that.session =  session(options);
};

gpii.express.middleware.session.middleware = function (that, req, res, next) {
    that.session(req, res, next);
};

fluid.defaults("gpii.express.middleware.session", {
    config:     "{expressConfigHolder}.options.config",
    gradeNames: ["fluid.modelComponent", "gpii.express.middleware"],
    invokers: {
        "middleware": {
            funcName: "gpii.express.middleware.session.middleware",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.middleware.session.init",
            "args": [ "{that}"]
        }
    }
});