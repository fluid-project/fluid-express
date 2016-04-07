// Test router module to expose the "req" object so that we can confirm that our middleware is installed correctly.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.tests.express.router.reqview");

gpii.tests.express.router.reqview.route = function (req, res) {
    res.status(200).send(JSON.stringify({"cookies": req.cookies, "params": req.params, "query": req.query, "session": req.session, "body": req.body }));
};

fluid.defaults("gpii.tests.express.router.reqview", {
    gradeNames: ["gpii.express.router"],
    path:       "/reqview",
    invokers: {
        route: {
            funcName: "gpii.tests.express.router.reqview.route",
            args:     ["{arguments}.0", "{arguments}.1"]
        }
    }
});