// Module to add session handling to express.
"use strict";
var fluid     = fluid || require("infusion");
var gpii      = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.session");

require("./configholder");

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
    config:     "{expressConfigHolder}.options.config",
    gradeNames: ["fluid.modelComponent", "gpii.express.middleware"],
    invokers: {
        "getMiddleware": {
            funcName: "gpii.express.middleware.session.getMiddleware",
            "args": [ "{that}"]
        }
    }
});