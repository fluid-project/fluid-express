// Module to add session handling to express.
"use strict";
var namespace = "gpii.express.middleware.session";
var fluid     = fluid || require('infusion');
var gpii      = fluid.registerNamespace("gpii");
var session   = fluid.registerNamespace(namespace);

session.session = function(that, req, res, next) {
    if (!that.privateSession) {
        var session   = require('express-session');
        var options = {
            secret:            that.options.config.express.session.secret,
            resave:            that.options.config.express.session.resave ? true : false,
            saveUninitialized: that.options.config.express.session.saveUninitialized ? true: false
        };
        that.privateSession = session(options);
    }

    that.privateSession(req, res, next);
};

fluid.defaults(namespace, {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    model: {
        middleware: ["session"]
    },
    invokers: {
        "session": {
            funcName: namespace + ".session",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});