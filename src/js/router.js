/*

    The base grade for express router modules.  See the documentation for details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/router.md

 */
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.express.router");

/**
 *
 * @param {Object} that - The router object itself.
 *
 * Instantiate our router object.  The root `fluid.express` instance will wire everything together.
 *
 */
fluid.express.router.createRouter = function (that) {
    var express = require("express");
    that.router = express.Router(that.options.routerOptions); // eslint-disable-line new-cap

    // Tell the `fluid.express.routable` bits we use to wire in our children.
    that.events.onReadyToWireChildren.fire(that);
};

fluid.express.router.getRouter = function (that) {
    var wrappedRouterFn = function wrappedRouter(request, response, next) {
        that.router(request, response, next);
    };

    wrappedRouterFn.that = that;
    wrappedRouterFn.path = fluid.express.pathForComponent(that);

    return wrappedRouterFn;
};

fluid.defaults("fluid.express.router", {
    gradeNames:    ["fluid.express.routable", "fluid.express.middleware"],
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
            funcName: "fluid.express.router.getRouter",
            args:     ["{that}"]
        }
    },
    listeners: {
        onCreate: {
            funcName: "fluid.express.router.createRouter",
            args:     ["{that}"]
        }
    }
});
