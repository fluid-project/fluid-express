/*

    The base grade for express router modules.  See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/router.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.router");

/**
 *
 * @param that {Object} - The router object itself.
 *
 * Instantiate our router object.  The root `gpii.express` instance will wire everything together.
 * 
 */
gpii.express.router.createRouter = function (that) {
    var express = require("express");
    that.router = express.Router(that.options.routerOptions);
    that.events.routerLoaded.fire(that);
};

gpii.express.router.getRouter = function (that) {
    return that.router;
};

fluid.defaults("gpii.express.router", {
    gradeNames:    ["gpii.express.middleware"],
    routerOptions: {},
    events: {
        routerLoaded: null,
        onReady: {
            events: {
                routerLoaded: "routerLoaded"
            },
            args: ["{that}"]
        }
    },
    invokers: {
        getMiddlewareFn: {
            funcName: "gpii.express.router.getRouter",
            args:     ["{that}"]
        },
        middleware: {
            funcName: "fluid.identity"
        }
    },
    listeners: {
        onCreate: {
            funcName: "gpii.express.router.createRouter",
            args:     ["{that}"]
        }
    }
});
