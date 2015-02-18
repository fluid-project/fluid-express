// Module to add body parsing to express.
"use strict";
var fluid = fluid || require('infusion');
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.cookieparser");

var cp           = require('cookie-parser');

gpii.express.middleware.cookieparser.cookieparser = function(that, req, res, next) {
    if (!that.privateCookieParser) {
        that.privateCookieParser = cp();
    }

    that.privateCookieParser(req, res, next);
};

fluid.defaults("gpii.express.middleware.cookieparser", {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    model: {
        middleware: ["cookieparser"]
    },
    invokers: {
        "cookieparser": {
            funcName: "gpii.express.middleware.cookieparser.cookieparser",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});