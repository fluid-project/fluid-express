// Module to add session handling to express.
"use strict";
var fluid     = fluid || require("infusion");
var gpii      = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.session");

gpii.express.middleware.session.getMiddleware = function (that) {
    var session   = require("express-session");
    var options = {
        secret:            that.options.config.express.session.secret,
        resave:            that.options.config.express.session.resave ? true : false,
        saveUninitialized: that.options.config.express.session.saveUninitialized ? true: false
    };
    return session(options);
};

fluid.defaults("gpii.express.middleware.session", {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    invokers: {
        "getMiddleware": {
            funcName: "gpii.express.middleware.session.getMiddleware",
            "args": [ "{that}"]
        }
    }
});