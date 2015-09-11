// Sample "Hello World" router module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.params");

gpii.express.tests.router.params.route = function (req, res) {
    res.status(200).send("Param is set to '" + req.params.myVar + "'...");
};

fluid.defaults("gpii.express.tests.router.params", {
    gradeNames: ["gpii.express.router"],
    method: "get",
    invokers: {
        route: {
            funcName: "gpii.express.tests.router.params.route",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});