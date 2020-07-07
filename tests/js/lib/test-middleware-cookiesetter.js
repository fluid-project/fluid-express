// Sample "Hello World" middleware module
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.test.express.middleware.cookie");

fluid.test.express.middleware.cookie.middleware = function (req, res) {
    res.status(200).cookie("foo", "bar").send({ok: true, message: "You should now have a cookie set..."});
};

fluid.defaults("fluid.test.express.middleware.cookie", {
    gradeNames: ["fluid.express.middleware"],
    method:     "get",
    path:       "/cookie",
    invokers: {
        middleware: {
            funcName: "fluid.test.express.middleware.cookie.middleware",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});
