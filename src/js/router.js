"use strict";
// Base grade for express router modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into its routing table.
//
// This implementation is not meant to be used directly.  You must extend this grade and implement addRoutes() properly
//
// See the tests for an example.

var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.router");

// Instantiate our router object.  The root gpii.express object will wire everything together
gpii.express.router.createRouter = function(that) {
    if (!that.options.config || !that.options.config.express) {
        console.error("Can't instantiate router without a working config object.");
        return null;
    }

    var express         = require("express");
    that.options.router = express.Router();
    //that.options.router[that.options.method](that.options.path, that.getRouter());
    that.events.routerLoaded.fire(that);
};

// If a working getRouter() is not found, someone has not properly implemented their grade.
gpii.express.router.complainAboutMissingFunction = function() {
    throw(new Error("Your grade must have an getRouter() invoker."));
};

fluid.defaults("gpii.express.router", {
    gradeNames: ["fluid.eventedComponent", "fluid.standardRelayComponent", "autoInit"],
    method:     "use",
    path:       null,
    config: "{gpii.express}.options.config",
    router: null,
    events: {
        routerLoaded:    null
    },
    invokers: {
        "getRouter": {
            "funcName": "gpii.express.router.complainAboutMissingFunction",
            args: ["{that}"]
        }
    },
    listeners: {
        "onCreate": {
            funcName: "gpii.express.router.createRouter",
            args: ["{that}"]
        }
    }
});
