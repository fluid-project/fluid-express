"use strict";
// Base grade for express router modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into its routing table.
//
// This implementation is not meant to be used directly.  When wrapping most existing Express routers, you will want
// to implement your own `getHandler` method and (typically) return their handler function.
//
// For all other use cases, you should likely start with `requestAwareRouter` and implement your own handler.
//
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.router");

// Instantiate our router object.  The root gpii.express object will wire everything together
gpii.express.router.createRouter = function (that) {
    var express         = require("express");
    that.options.router = express.Router();
    that.events.routerLoaded.fire(that);
};

// If a working getHandler() is not found, someone has not properly implemented their grade.
gpii.express.router.complainAboutMissingFunction = function () {
    fluid.fail("Your grade must have an getHandler() invoker.");
};

fluid.defaults("gpii.express.router", {
    gradeNames: ["fluid.component"],
    method:     "use",
    path:       null,
    router:     null,
    events: {
        routerLoaded: null
    },
    invokers: {
        getHandler: {
            funcName: "gpii.express.router.complainAboutMissingFunction",
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
