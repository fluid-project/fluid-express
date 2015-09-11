// Sample "Hello World" router module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.cookie");

gpii.express.tests.router.cookie.handler = function (req, res) {
    res.status(200).cookie("foo", "bar").send({ok: true, message: "You should now have a cookie set..."});
};

fluid.defaults("gpii.express.tests.router.cookie", {
    gradeNames: ["gpii.express.router"],
    path:       "/cookie",
    method:     "get",
    invokers: {
        "handler": {
            funcName: "gpii.express.tests.router.cookie.handler",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});