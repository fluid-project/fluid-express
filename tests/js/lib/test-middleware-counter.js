// Sample middleware loader
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.test.express.middleware.counter");

fluid.test.express.middleware.counter.middleware = function (that, req, res, next) {
    that.applier.change("count", that.model.count + 1);
    next();
};

fluid.defaults("fluid.test.express.middleware.counter", {
    gradeNames: ["fluid.express.middleware", "fluid.modelComponent"],
    namespace:  "counter",
    model: {
        count: 0
    },
    invokers: {
        "middleware": {
            "funcName": "fluid.test.express.middleware.counter.middleware",
            "args":     [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});
