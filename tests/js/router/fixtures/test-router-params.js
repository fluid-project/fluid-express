// Sample "Hello World" router module
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.tests.express.router.params");

gpii.tests.express.router.params.route = function (req, res) {
    res.status(200).send("Param is set to '" + req.params.myVar + "'...");
};

fluid.defaults("gpii.tests.express.router.params", {
    gradeNames: ["gpii.express.router"],
    method: "get",
    invokers: {
        route: {
            funcName: "gpii.tests.express.router.params.route",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});