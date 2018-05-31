/*

    Module to serve up directory listings, typically for content hosted with the "static" router.  See the
    documentation for more details:

    https://github.com/GPII/gpii-express/blob/master/docs/router.md

 */
"use strict";
var fluid      = require("infusion");
var gpii       = fluid.registerNamespace("gpii");
var serveIndex = require("serve-index");

require("./static");

fluid.registerNamespace("gpii.express.middleware.serveIndex");

/**
 *
 * Expand key options and instantiate the underlying serveIndex middleware.
 *
 * @param {String|Array<String>} content - The content directory or directories to index.  If an array is passed, only the first directory will be used.
 * @param {Object} serveIndexMiddlewareOptions - The configuration options to use when instantiating the serveIndex middleware.
 * @return {Function} - The instantiated serveIndex middleware instance.
 */
gpii.express.middleware.serveIndex.init = function (content, serveIndexMiddlewareOptions) {
    var allPaths = gpii.express.expandPaths(content);
    if (allPaths.length > 1) {
        fluid.log("WARN: Multiple content paths found.  Only content from the first content directory will be used in generating the directory index.");
    }

    return serveIndex(allPaths[0], serveIndexMiddlewareOptions);
};

gpii.express.middleware.serveIndex.getMiddlewareFn = function (that) {
    return that.serveIndexMiddleware;
};

fluid.defaults("gpii.express.middleware.serveIndex", {
    gradeNames: ["gpii.express.middleware"],
    namespace: "serveIndex",
    content: null,
    serveIndexMiddlewareOptions: gpii.express.middleware.serveIndex.defaultOptions,
    members: {
        serveIndexMiddleware: {
            expander: {
                funcName: "gpii.express.middleware.serveIndex.init",
                args:     ["{that}.options.content", "{that}.options.serveIndexMiddlewareOptions"]
            }
        }
    },
    invokers: {
        "getMiddlewareFn": {
            funcName: "gpii.express.middleware.serveIndex.getMiddlewareFn",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.router.serveContentAndIndex", {
    gradeNames: ["gpii.express.router"],
    content: "%my-package/src/content",
    serveIndexMiddlewareOptions: { icons: true},
    staticMiddlewareOptions: {},
    components: {
        // This comes first so that index.html will win out if it's present.
        static: {
            type: "gpii.express.router.static",
            options: {
                priority: "before:serveIndex",
                content: "{gpii.express.router.serveContentAndIndex}.options.content",
                staticMiddlewareOptions: "{gpii.express.router.serveContentAndIndex}.options.staticMiddlewareOptions"
            }
        },
        serveIndex: {
            type: "gpii.express.middleware.serveIndex",
            options: {
                content: "{gpii.express.router.serveContentAndIndex}.options.content",
                serveIndexMiddlewareOptions: "{gpii.express.router.serveContentAndIndex}.options.serveIndexMiddlewareOptions"
            }
        }
    }
});
