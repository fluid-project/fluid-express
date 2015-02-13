// Sample middleware loader
"use strict";
var namespace      = "gpii.express.tests.middleware.counter";
var fluid          = fluid || require('infusion');
var gpii           = fluid.registerNamespace("gpii");
var testMiddleware = fluid.registerNamespace(namespace);

testMiddleware.counterPrivate = function(that, req, res, next) {
    that.applier.change("count", that.model.count + 1);
    next();
};

fluid.defaults(namespace, {
    gradeNames: ["gpii.express.middleware", "autoInit"],
    model: {
        count: 0,
        middleware: [ "counter" ]
    },
    invokers: {
        "counter": {
            "funcName": namespace + ".counterPrivate",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});