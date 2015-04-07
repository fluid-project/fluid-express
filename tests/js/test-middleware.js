// Sample middleware loader
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.middleware.counter");

gpii.express.tests.middleware.counter.getMiddleware = function (that) {
    return function (req, res, next) {
        that.applier.change("count", that.model.count + 1);
        next();
    };
};

fluid.defaults("gpii.express.tests.middleware.counter", {
    gradeNames: ["gpii.express.middleware", "fluid.modelRelayComponent", "autoInit"],
    model: {
        count: 0
    },
    invokers: {
        "getMiddleware": {
            "funcName": "gpii.express.tests.middleware.counter.getMiddleware",
            "args": [ "{that}"]
        }
    }
});