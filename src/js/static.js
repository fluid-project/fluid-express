/*

    Module to serve up static files available in the `content` directory.  See the documentation for more details:

    https://github.com/GPII/gpii-express/blob/master/docs/router.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var express = require("express");

fluid.registerNamespace("gpii.express.middleware.static");

/**
 *
 * An expander to instantiate the underlying static middleware.
 *
 * @param {String} contentDir - The full or package-relative path to the content directory.
 * @param {Object} staticMiddlewareOptions - Configuration options to pass to the underlying middleware.
 * @return {Function} - The instantiated static middleware instance.
 *
 */
gpii.express.middleware["static"].init = function (contentDir, staticMiddlewareOptions) {
    return express["static"](contentDir, staticMiddlewareOptions);
};

gpii.express.middleware["static"].getMiddlewareFn = function (that) {
    return that.staticMiddleware;
};

fluid.defaults("gpii.express.middleware.static", {
    gradeNames: ["gpii.express.middleware"],
    members: {
        staticMiddleware: {
            expander: {
                funcName: "gpii.express.middleware.static.init",
                args: ["{that}.options.contentDir", "{that}.options.staticMiddlewareOptions"]
            }
        }
    },
    invokers: {
        "getMiddlewareFn": {
            funcName: "gpii.express.middleware.static.getMiddlewareFn",
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
