// Sample "Hello World" middleware module
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.tests.express.middleware.params");

gpii.tests.express.middleware.params.middleware = function (req, res) {
    res.status(200).send("Param is set to '" + req.params.myVar + "'...");
};

fluid.defaults("gpii.tests.express.middleware.params", {
    gradeNames: ["gpii.express.middleware"],
    method: "get",
    invokers: {
        middleware: {
            funcName: "gpii.tests.express.middleware.params.middleware",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});