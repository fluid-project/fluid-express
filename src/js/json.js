/* eslint-env node */
/*

    Module to add body parsing to express.  See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/middleware.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.bodyparser.json");

var bp = require("body-parser");

/**
 *
 * @param that {Object} - The middleware component itself.
 *
 * Initialize the component by creating a private instance of body-parser.json
 *
 */
gpii.express.middleware.bodyparser.json.init = function (that) {
    that.json = bp.json();
};

/**
 *
 * @param that {Object} - The middleware component itself.
 * @param req {Object} - The Express request object.
 * @param res {Object} - The Express response object.
 * @param next {Function} - The next piece of middleware in the chain.
 */
gpii.express.middleware.bodyparser.json.middleware = function (that, req, res, next) {
    that.json(req, res, next);
};

fluid.defaults("gpii.express.middleware.bodyparser.json", {
    gradeNames: ["gpii.express.middleware"],
    namespace: "json",
    invokers: {
        "middleware": {
            funcName: "gpii.express.middleware.bodyparser.json.middleware",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.middleware.bodyparser.json.init",
            args:     ["{that}"]
        }
    }
});
