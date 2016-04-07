// Sample middleware loader
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.tests.express.middleware.counter");

gpii.tests.express.middleware.counter.middleware = function (that, req, res, next) {
    that.applier.change("count", that.model.count + 1);
    next();
};

fluid.defaults("gpii.tests.express.middleware.counter", {
    gradeNames: ["gpii.express.middleware", "fluid.modelComponent"],
    model: {
        count: 0
    },
    invokers: {
        "middleware": {
            "funcName": "gpii.tests.express.middleware.counter.middleware",
            "args":     [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});