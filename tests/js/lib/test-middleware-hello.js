// Sample "Hello World" middleware
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.test.express.middleware.hello");

fluid.test.express.middleware.hello.middleware = function (that, req, res) {
    res.status(200).send(that.options.message);
};

fluid.defaults("fluid.test.express.middleware.hello", {
    gradeNames: ["fluid.express.middleware"],
    method:     "get",
    message:    "Hello, World",
    invokers: {
        middleware: {
            funcName: "fluid.test.express.middleware.hello.middleware",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});
