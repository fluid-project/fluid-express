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
 * @param {Object} that - The router object itself.
 *
 * Instantiate our router object.  The root `gpii.express` instance will wire everything together.
 *
 */
gpii.express.router.createRouter = function (that) {
    var express = require("express");
    that.router = express.Router(that.options.routerOptions); // eslint-disable-line new-cap

    // Tell the `gpii.express.routable` bits we use to wire in our children.
    that.events.onReadyToWireChildren.fire(that);
};

gpii.express.router.getRouter = function (that) {
    var wrappedRouterFn = function wrappedRouter(request, response, next) {
        that.router(request, response, next);
    };

    wrappedRouterFn.that = that;
    wrappedRouterFn.path = gpii.express.pathForComponent(that);

    return wrappedRouterFn;
};

fluid.defaults("gpii.express.router", {
    gradeNames:    ["gpii.express.routable", "gpii.express.middleware"],
    routerOptions: {},
    events: {
        onReady: {
            events: {
                onChildrenWired: "onChildrenWired"
            },
            args: ["{that}"]
        }
    },
    invokers: {
        getMiddlewareFn: {
            funcName: "gpii.express.router.getRouter",
            args:     ["{that}"]
        }
    },
    listeners: {
        onCreate: {
            funcName: "gpii.express.router.createRouter",
            args:     ["{that}"]
        }
    }
});
