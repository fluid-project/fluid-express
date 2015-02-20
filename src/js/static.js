// Module to serve static content using the express static middleware
"use strict";
var fluid        = fluid || require('infusion');
var gpii         = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.router.static");

var express      = require("express");

gpii.express.router.static.getStaticRouterFunction = function(that) {
    if (!that.options.path) {
        console.log("You must configure a path for a gpii.express.router grade...");
        return null;
    }

    if (!that.options.content) {
        console.log("You must configure a content value to indicate what static content is to be served.");
        return;
    }

    return express.static(that.options.content);
};

fluid.defaults("gpii.express.router.static", {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.router", "autoInit"],
    content: null,
    router:  null,
    invokers: {
        "getRouterFunction": {
            funcName: "gpii.express.router.static.getStaticRouterFunction",
            args: ["{that}"]
        }
    }
});