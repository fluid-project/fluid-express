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

fluid.registerNamespace("gpii.express.router.serveIndex");
gpii.express.router.serveIndex.init = function (that) {
    var allPaths = gpii.express.expandPaths(that.options.content);
    if (allPaths.length > 1) {
        fluid.log("WARN: Multiple content paths found.  Only content from the first content directory will be used in generating the directory index.");
    }

    that.router.use(serveIndex(allPaths[0], that.options.serveIndexMiddlewareOptions));
};

gpii.express.router.serveIndex.defaultOptions = { icons: true};

fluid.defaults("gpii.express.router.serveIndex", {
    gradeNames: ["gpii.express.router"],
    namespace: "serveIndex",
    content: null,
    serveIndexMiddlewareOptions: gpii.express.router.serveIndex.defaultOptions,
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.router.serveIndex.init",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.router.serveContentAndIndex", {
    gradeNames: ["gpii.express.router"],
    content: "%my-package/src/content",
    serveIndexMiddlewareOptions: gpii.express.router.serveIndex.defaultOptions,
    staticMiddlewareOptions: {},
    components: {
        serveIndex: {
            type: "gpii.express.router.serveIndex",
            options: {
                content: "{gpii.express.router.serveContentAndIndex}.options.content",
                serveIndexMiddlewareOptions: "{gpii.express.router.serveContentAndIndex}.options.serveIndexMiddlewareOptions"
            }
        },
        static: {
            type: "gpii.express.router.static",
            options: {
                priority: "after:serveIndex",
                content: "{gpii.express.router.serveContentAndIndex}.options.content",
                staticMiddlewareOptions: "{gpii.express.router.serveContentAndIndex}.options.staticMiddlewareOptions"
            }
        }
    }
});
