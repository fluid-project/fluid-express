// Module to serve static content using the express static middleware
"use strict";
var namespace    = "gpii.express.router.static";
var fluid        = fluid || require('infusion');
var gpii         = fluid.registerNamespace("gpii");
var staticRouter = fluid.registerNamespace(namespace);
var express      = require("express");
var path         = require("path");

staticRouter.addRoutesPrivate = function(that) {
    if (!that.options.path) {
        console.log("You must configure a path for a gpii.express.router grade...");
        return null;
    }

    if (!that.options.content) {
        console.log("You must configure a content value to indicate what static content is to be served.");
        return;
    }

    that.model.router.use(that.options.path, express.static(that.options.content)); // jshint ignore:line
};

fluid.defaults(namespace, {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.router", "autoInit"],
    content: null,
    model: {
        router:  null
    },
    events: {
        addRoutes: null
    },
    listeners: {
        "addRoutes": {
            funcName: namespace + ".addRoutesPrivate",
            args: ["{that}"]
        }
    }
});