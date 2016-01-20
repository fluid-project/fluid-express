"use strict";
// Base grade for express router modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into its routing table.
//
// When the underlying router is created, its constructor will be passed `options.routerOptions`.  For a list of the
// supported options, check out [the Express documentation](http://expressjs.com/api.html#router).
//
// This implementation is not meant to be used directly.  When wrapping most existing Express routers, you will want
// to implement your own `router` method and (typically) point your `router` invoker at that.
//
// For all other use cases, you should likely start with `requestAwareRouter` and implement your own handler.
//
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.router");

// Instantiate our router object.  The root gpii.express object will wire everything together
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
