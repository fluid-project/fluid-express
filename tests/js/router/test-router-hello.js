// Sample "Hello World" router module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.hello");

gpii.express.tests.router.hello.route = function (that, req, res) {
    res.status(200).send(that.options.message);
};

fluid.defaults("gpii.express.tests.router.hello", {
    gradeNames: ["gpii.express.router"],
    method:     "get",
    path:       "/hello",
    message:    "Hello, World",
    invokers: {
        route: {
            funcName: "gpii.express.tests.router.hello.route",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});