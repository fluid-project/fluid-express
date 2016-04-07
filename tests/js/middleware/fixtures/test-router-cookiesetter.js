// Sample "Hello World" router module
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.tests.express.router.cookie");

gpii.tests.express.router.cookie.route = function (req, res) {
    res.status(200).cookie("foo", "bar").send({ok: true, message: "You should now have a cookie set..."});
};

fluid.defaults("gpii.tests.express.router.cookie", {
    gradeNames: ["gpii.express.router"],
    path:       "/cookie",
    method:     "get",
    invokers: {
        route: {
            funcName: "gpii.tests.express.router.cookie.route",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});