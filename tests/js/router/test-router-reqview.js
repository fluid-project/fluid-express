// Test router module to expose the "req" object so that we can confirm that our middleware is installed correctly.
"use strict";
var fluid     = fluid || require("infusion");
var gpii      = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.reqview");

gpii.express.tests.router.reqview.handler = function (req, res) {
    res.status(200).send(JSON.stringify({"cookies": req.cookies, "params": req.params, "query": req.query, "session": req.session, "body": req.body }));
};

fluid.defaults("gpii.express.tests.router.reqview", {
    gradeNames: ["gpii.express.router"],
    path:       "/reqview",
    invokers: {
        "handler": {
            funcName: "gpii.express.tests.router.reqview.handler",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});