/* eslint-env node */
/*

    Module to serve up static files available in the `content` directory.  See the documentation for more details:

    https://github.com/GPII/gpii-express/blob/master/docs/router.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.router.static");

var express = require("express");

// The Express module is actually named "static", so for clarity I want to use that name in spite of the warnings in older versions of JSHint
/* jshint -W024 */
gpii.express.router["static"].init = function (that) {
    fluid.each(gpii.express.expandPaths(that.options.content), function (contentDir) {
        that.router.use(express["static"](contentDir));
    });
};

fluid.defaults("gpii.express.router.static", {
    gradeNames: ["gpii.express.router"],
    namespace: "static",
    content: null,
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.router.static.init",
            args:     ["{that}"]
        }
    }
});
