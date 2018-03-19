/*

    Module to serve up static files available in the `content` directory.  See the documentation for more details:

    https://github.com/GPII/gpii-express/blob/master/docs/router.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var express = require("express");

fluid.registerNamespace("gpii.express.middleware.static");

gpii.express.middleware["static"].init = function (that) {
    that.staticMiddleware = express["static"](that.options.contentDir, that.options.staticMiddlewareOptions);
};

gpii.express.middleware["static"].getMiddlewareFn = function (that) {
    return that.staticMiddleware;
};

fluid.defaults("gpii.express.middleware.static", {
    gradeNames: ["gpii.express.middleware"],
    members: {
        staticMiddleware: fluid.fail
    },
    invokers: {
        "getMiddlewareFn": {
            funcName: "gpii.express.middleware.static.getMiddlewareFn",
            args:     ["{that}"]
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.middleware.static.init",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.router.static", {
    gradeNames: ["gpii.express.router"],
    namespace: "static",
    method: "use",
    content: null,
    staticMiddlewareOptions: {},
    dynamicComponents:{
        contentMiddleware: {
            sources: "@expand:gpii.express.expandPaths({gpii.express.router.static}.options.content)",
            type:    "gpii.express.middleware.static",
            options: {
                contentDir: "{source}",
                staticMiddlewareOptions: "{gpii.express.router.static}.options.staticMiddlewareOptions"
            }
        }
    }
});
