// Module to add body parsing to express.
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.middleware.cookieparser");

var cp = require("cookie-parser");

gpii.express.middleware.cookieparser.getMiddleware = function () {
    return cp();
};

fluid.defaults("gpii.express.middleware.cookieparser", {
    gradeNames: ["fluid.modelComponent", "gpii.express.middleware"],
    invokers: {
        "getMiddleware": {
            funcName: "gpii.express.middleware.cookieparser.getMiddleware"
        }
    }
});