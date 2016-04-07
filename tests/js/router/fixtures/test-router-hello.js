// Sample "Hello World" router module
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.tests.express.router.hello");

gpii.tests.express.router.hello.route = function (that, req, res) {
    res.status(200).send(that.options.message);
};

fluid.defaults("gpii.tests.express.router.hello", {
    gradeNames: ["gpii.express.router"],
    method:     "get",
    path:       "/hello",
    message:    "Hello, World",
    invokers: {
        route: {
            funcName: "gpii.tests.express.router.hello.route",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});