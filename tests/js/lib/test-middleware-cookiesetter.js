// Sample "Hello World" middleware module
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.test.express.middleware.cookie");

gpii.test.express.middleware.cookie.middleware = function (req, res) {
    res.status(200).cookie("foo", "bar").send({ok: true, message: "You should now have a cookie set..."});
};

fluid.defaults("gpii.test.express.middleware.cookie", {
    gradeNames: ["gpii.express.middleware"],
    method:     "get",
    path:       "/cookie",
    invokers: {
        middleware: {
            funcName: "gpii.test.express.middleware.cookie.middleware",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});
