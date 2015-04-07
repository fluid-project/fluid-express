// Sample "Hello World" router module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.cookie");

gpii.express.tests.router.cookie.getRouter = function () {
    return function (req, res) {
        res.status(200).cookie("foo", "bar").send({ok: true, message: "You should now have a cookie set..."});
    };
};

fluid.defaults("gpii.express.tests.router.cookie", {
    gradeNames: ["gpii.express.router", "autoInit"],
    path:    "/cookie",
    method: "get",
    invokers: {
        "getRouter": {
            funcName: "gpii.express.tests.router.cookie.getRouter",
            args: ["{that}"]
        }
    }
});