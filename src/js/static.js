/*

    Module to serve up static files available in the `content` directory.  See the documentation for more details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/router.md

 */
"use strict";
var fluid = require("infusion");

var express = require("express");

fluid.registerNamespace("fluid.express.middleware.static");

/**
 *
 * An expander to instantiate the underlying static middleware.
 *
 * @param {String} contentDir - The full or package-relative path to the content directory.
 * @param {Object} staticMiddlewareOptions - Configuration options to pass to the underlying middleware.
 * @return {Function} - The instantiated static middleware instance.
 *
 */
fluid.express.middleware["static"].init = function (contentDir, staticMiddlewareOptions) {
    return express["static"](contentDir, staticMiddlewareOptions);
};

fluid.express.middleware["static"].getMiddlewareFn = function (that) {
    return that.staticMiddleware;
};

fluid.defaults("fluid.express.middleware.static", {
    gradeNames: ["fluid.express.middleware"],
    members: {
        staticMiddleware: {
            expander: {
                funcName: "fluid.express.middleware.static.init",
                args: ["{that}.options.contentDir", "{that}.options.staticMiddlewareOptions"]
            }
        }
    },
    invokers: {
        "getMiddlewareFn": {
            funcName: "fluid.express.middleware.static.getMiddlewareFn",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("fluid.express.router.static", {
    gradeNames: ["fluid.express.router"],
    namespace: "static",
    method: "use",
    content: null,
    staticMiddlewareOptions: {},
    dynamicComponents:{
        contentMiddleware: {
            sources: "@expand:fluid.express.expandPaths({fluid.express.router.static}.options.content)",
            type:    "fluid.express.middleware.static",
            options: {
                contentDir: "{source}",
                staticMiddlewareOptions: "{fluid.express.router.static}.options.staticMiddlewareOptions"
            }
        }
    }
});
