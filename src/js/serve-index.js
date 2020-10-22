/*

    Module to serve up directory listings, typically for content hosted with the "static" router.  See the
    documentation for more details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/router.md

 */
"use strict";
var fluid      = require("infusion");
var serveIndex = require("serve-index");

require("./static");

fluid.registerNamespace("fluid.express.middleware.serveIndex");

/**
 *
 * Expand key options and instantiate the underlying serveIndex middleware.
 *
 * @param {String|Array<String>} content - The content directory or directories to index.  If an array is passed, only the first directory will be used.
 * @param {Object} serveIndexMiddlewareOptions - The configuration options to use when instantiating the serveIndex middleware.
 * @return {Function} - The instantiated serveIndex middleware instance.
 */
fluid.express.middleware.serveIndex.init = function (content, serveIndexMiddlewareOptions) {
    var allPaths = fluid.express.expandPaths(content);
    if (allPaths.length > 1) {
        fluid.log("WARN: Multiple content paths found.  Only content from the first content directory will be used in generating the directory index.");
    }

    return serveIndex(allPaths[0], serveIndexMiddlewareOptions);
};

fluid.express.middleware.serveIndex.getMiddlewareFn = function (that) {
    return that.serveIndexMiddleware;
};

fluid.defaults("fluid.express.middleware.serveIndex", {
    gradeNames: ["fluid.express.middleware"],
    namespace: "serveIndex",
    content: null,
    serveIndexMiddlewareOptions: fluid.express.middleware.serveIndex.defaultOptions,
    members: {
        serveIndexMiddleware: {
            expander: {
                funcName: "fluid.express.middleware.serveIndex.init",
                args:     ["{that}.options.content", "{that}.options.serveIndexMiddlewareOptions"]
            }
        }
    },
    invokers: {
        "getMiddlewareFn": {
            funcName: "fluid.express.middleware.serveIndex.getMiddlewareFn",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("fluid.express.router.serveContentAndIndex", {
    gradeNames: ["fluid.express.router"],
    content: "%my-package/src/content",
    serveIndexMiddlewareOptions: { icons: true},
    staticMiddlewareOptions: {},
    components: {
        // This comes first so that index.html will win out if it's present.
        static: {
            type: "fluid.express.router.static",
            options: {
                priority: "before:serveIndex",
                content: "{fluid.express.router.serveContentAndIndex}.options.content",
                staticMiddlewareOptions: "{fluid.express.router.serveContentAndIndex}.options.staticMiddlewareOptions"
            }
        },
        serveIndex: {
            type: "fluid.express.middleware.serveIndex",
            options: {
                content: "{fluid.express.router.serveContentAndIndex}.options.content",
                serveIndexMiddlewareOptions: "{fluid.express.router.serveContentAndIndex}.options.serveIndexMiddlewareOptions"
            }
        }
    }
});
