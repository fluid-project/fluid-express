/* eslint-env node */
// Test middleware module to expose the "req" object so that we can confirm that our middleware is installed correctly.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.test.express.middleware.reqview");

gpii.test.express.middleware.reqview.middleware = function (req, res) {
    res.status(200).send(JSON.stringify({"cookies": req.cookies, "params": req.params, "query": req.query, "session": req.session, "body": req.body }));
};

fluid.defaults("gpii.test.express.middleware.reqview", {
    gradeNames: ["gpii.express.middleware"],
    invokers: {
        middleware: {
            funcName: "gpii.test.express.middleware.reqview.middleware",
            args:     ["{arguments}.0", "{arguments}.1"] // request, response
        }
    }
});
