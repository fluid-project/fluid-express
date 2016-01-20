// Module to serve up the static files available in the `content` directory.
//
// You can use full directory references, but best practice is to register your package's home directory using
// `fluid.module.register`, as in:
//
// `fluid.module.register("npm-package-name", __dirname, require);`
//
// You should then set `options.content` using notation like:
//
// `%npm-package-name/path/to/content/within/package`
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.router.static");

var express = require("express");

// The library is actually named "static", so for clarity I want to use that name in spite of the warnings in older versions of JSHint
/* jshint -W024 */
gpii.express.router["static"].init = function (that) {
    if (!that.options.path) {
        fluid.fail("You must configure a path for a gpii.express.router grade...");
    }

    if (!that.options.content) {
        fluid.fail("You must configure a content value to indicate what static content is to be served.");
    }

    that.staticHandler = express["static"](fluid.module.resolve(that.options.content));
};

gpii.express.router["static"].route = function (that, req, res, next) {
    that.staticHandler(req, res, next);
};

fluid.defaults("gpii.express.router.static", {
    gradeNames: ["fluid.modelComponent", "gpii.express.router"],
    content: null,
    router:  null,
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.router.static.init",
            args:     ["{that}"]
        }
    },
    invokers: {
        route: {
            "funcName": "gpii.express.router.static.route",
            "args":     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});