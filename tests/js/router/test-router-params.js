// Sample "Hello World" router module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.params");

gpii.express.tests.router.params.getHandler = function () {
    return function (req, res) {
        res.status(200).send("Param is set to '" + req.params.myVar + "'...");
    };
};

fluid.defaults("gpii.express.tests.router.params", {
    gradeNames: ["gpii.express.router", "autoInit"],
    method: "get",
    invokers: {
        "getHandler": {
            funcName: "gpii.express.tests.router.params.getHandler",
            args: ["{that}"]
        }
    }
});