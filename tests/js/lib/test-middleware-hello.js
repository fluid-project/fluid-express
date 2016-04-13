// Sample "Hello World" middleware
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.tests.express.middleware.hello");

gpii.tests.express.middleware.hello.middleware = function (that, req, res) {
    res.status(200).send(that.options.message);
};

fluid.defaults("gpii.tests.express.middleware.hello", {
    gradeNames: ["gpii.express.middleware"],
    method:     "get",
    message:    "Hello, World",
    invokers: {
        middleware: {
            funcName: "gpii.tests.express.middleware.hello.middleware",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});