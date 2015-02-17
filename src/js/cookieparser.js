// Module to add body parsing to express.
"use strict";
var namespace   = "gpii.express.middleware.cookieparser";
var fluid       = fluid || require('infusion');
var gpii        = fluid.registerNamespace("gpii");
var cookieParser = fluid.registerNamespace(namespace);
var cp           = require('cookie-parser');

cookieParser.cookieparser = function(that, req, res, next) {
    if (!that.privateCookieParser) {
        that.privateCookieParser = cp();
    }

    that.privateCookieParser(req, res, next);
};

fluid.defaults(namespace, {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.middleware", "autoInit"],
    model: {
        middleware: ["cookieparser"]
    },
    invokers: {
        "cookieparser": {
            funcName: namespace + ".cookieparser",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});