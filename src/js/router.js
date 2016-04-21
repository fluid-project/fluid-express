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
    that.container = express.Router(that.options.routerOptions);

    // Tell the `gpii.express.container` bits we use to wire in our children.
    that.events.onReadyToWireChildren.fire(that);
};

gpii.express.router.getRouter = function (that) {
    return that.container;
};

fluid.defaults("gpii.express.router", {
    gradeNames:    ["gpii.express.container", "gpii.express.middleware"],
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
