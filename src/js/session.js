/*

    Module to add session handling to express.  See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/middleware.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.session");

gpii.express.middleware.session.init = function (that) {
    var session   = require("express-session");
    that.session =  session(that.options.sessionOptions);
};

gpii.express.middleware.session.middleware = function (that, req, res, next) {
    that.session(req, res, next);
};

fluid.defaults("gpii.express.middleware.session", {
    gradeNames: ["fluid.modelComponent", "gpii.express.middleware"],
    namespace:  "session",
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
