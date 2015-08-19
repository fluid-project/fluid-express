// Sample "Hello World" router module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.cookie");

gpii.express.tests.router.cookie.getHandler = function () {
    return function (req, res) {
        res.status(200).cookie("foo", "bar").send({ok: true, message: "You should now have a cookie set..."});
    };
};

fluid.defaults("gpii.express.tests.router.cookie", {
    gradeNames: ["gpii.express.router"],
    path:    "/cookie",
    method: "get",
    invokers: {
        "getHandler": {
            funcName: "gpii.express.tests.router.cookie.getHandler",
            args: ["{that}"]
        }
    }
});