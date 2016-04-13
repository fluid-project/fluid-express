// Sample middleware loader
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.test.express.middleware.counter");

gpii.test.express.middleware.counter.middleware = function (that, req, res, next) {
    that.applier.change("count", that.model.count + 1);
    next();
};

fluid.defaults("gpii.test.express.middleware.counter", {
    gradeNames: ["gpii.express.middleware", "fluid.modelComponent"],
    namespace:  "counter",
    model: {
        count: 0
    },
    invokers: {
        "middleware": {
            "funcName": "gpii.test.express.middleware.counter.middleware",
            "args":     [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});