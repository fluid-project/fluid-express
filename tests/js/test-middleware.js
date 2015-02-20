// Sample middleware loader
"use strict";
var fluid = fluid || require('infusion');
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.middleware.counter");

gpii.express.tests.middleware.counter.getCounterFunction = function(that){
    return function(req, res, next) {
        that.applier.change("count", that.model.count + 1);
        next();
    };
};

fluid.defaults("gpii.express.tests.middleware.counter", {
    gradeNames: ["gpii.express.middleware", "autoInit"],
    model: {
        count: 0
    },
    invokers: {
        "getMiddlewareFunction": {
            "funcName": "gpii.express.tests.middleware.counter.getCounterFunction",
            "args": [ "{that}"]
        }
    }
});