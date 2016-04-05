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

fluid.defaults("gpii.express.router", {
    gradeNames: ["fluid.component"],
    method:     "use",
    path:       null,
    router:     null,
    routerOptions: {},
    events: {
        routerLoaded: null
    },
    invokers: {
        route: {
            funcName: "fluid.notImplemented"
        }
    },
    listeners: {
        onCreate: {
            funcName: "gpii.express.router.createRouter",
            args:     ["{that}"]
        }
    }
});
