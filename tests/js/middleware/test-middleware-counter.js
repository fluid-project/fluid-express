// Sample middleware loader
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.middleware.counter");

gpii.express.tests.middleware.counter.middleware = function (that, req, res, next) {
    that.applier.change("count", that.model.count + 1);
    next();
};

fluid.defaults("gpii.express.tests.middleware.counter", {
    gradeNames: ["gpii.express.middleware", "fluid.modelComponent"],
    model: {
        count: 0
    },
    invokers: {
        "middleware": {
            "funcName": "gpii.express.tests.middleware.counter.middleware",
            "args":     [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});