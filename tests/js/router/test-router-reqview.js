// Test router module to expose the "req" object so that we can confirm that our middleware is installed correctly.
"use strict";
var fluid     = fluid || require("infusion");
var gpii      = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.reqview");

gpii.express.tests.router.reqview.getRouter = function () {
    return function (req, res) {
        res.status(200).send(JSON.stringify({"cookies": req.cookies, "params": req.params, "query": req.query, "session": req.session, "body": req.body }));
    };
};

fluid.defaults("gpii.express.tests.router.reqview", {
    gradeNames: ["gpii.express.router", "autoInit"],
    path:       "/reqview",
    invokers: {
        "getRouter": {
            funcName: "gpii.express.tests.router.reqview.getRouter",
            args: ["{that}"]
        }
    }
});