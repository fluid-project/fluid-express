/* eslint-env node */
/*

    Router module to parse URL-encoded data in requests.  See the documentation for more details:

    https://github.com/GPII/gpii-express/blob/master/docs/middleware.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.bodyparser.urlencoded");

var bp = require("body-parser");

gpii.express.middleware.bodyparser.urlencoded.init = function (that) {
    that.urlencoded = bp.urlencoded({ extended: false });
};

gpii.express.middleware.bodyparser.urlencoded.middleware = function (that, req, res, next) {
    that.urlencoded(req, res, next);
};

fluid.defaults("gpii.express.middleware.bodyparser.urlencoded", {
    gradeNames: ["fluid.modelComponent", "gpii.express.middleware"],
    namespace: "urlencoded",
    invokers: {
        "middleware": {
            funcName: "gpii.express.middleware.bodyparser.urlencoded.middleware",
            args:     [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2" ]
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.middleware.bodyparser.urlencoded.init",
            args:     ["{that}"]
        }
    }
});
