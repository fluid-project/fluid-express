// Sample "Hello World" router module
"use strict";
var fluid = fluid || require('infusion');
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.params");

gpii.express.tests.router.params.getParamsFunction = function(that) {
    return function (req, res) {
        res.status(200).send("Param is set to '" + req.params.myvar + "'...");
    };
};

fluid.defaults("gpii.express.tests.router.params", {
    gradeNames: ["gpii.express.router", "autoInit"],
    path:    "/params/:myvar",
    method: "get",
    invokers: {
        "getRouterFunction": {
            funcName: "gpii.express.tests.router.params.getParamsFunction",
            args: ["{that}"]
        }
    }
});