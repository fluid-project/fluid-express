// Sample "Hello World" middleware module
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.test.express.middleware.params");

fluid.test.express.middleware.params.middleware = function (req, res) {
    res.status(200).send("Param is set to '" + req.params.myVar + "'...");
};

fluid.defaults("fluid.test.express.middleware.params", {
    gradeNames: ["fluid.express.middleware"],
    method: "get",
    invokers: {
        middleware: {
            funcName: "fluid.test.express.middleware.params.middleware",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});
