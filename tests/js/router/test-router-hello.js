// Sample "Hello World" router module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.hello");

gpii.express.tests.router.hello.getHandler = function (that) {
    return function (req, res) {
        res.status(200).send(that.options.message);
    };
};

fluid.defaults("gpii.express.tests.router.hello", {
    gradeNames: ["gpii.express.router"],
    method:     "get",
    path:       "/hello",
    message:    "Hello, World",
    invokers: {
        "getHandler": {
            funcName: "gpii.express.tests.router.hello.getHandler",
            args: ["{that}"]
        }
    }
});