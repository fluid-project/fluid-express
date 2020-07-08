// Test middleware module to expose the "req" object so that we can confirm that our middleware is installed correctly.
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.test.express.middleware.reqview");

fluid.test.express.middleware.reqview.middleware = function (req, res) {
    res.status(200).send(JSON.stringify({"cookies": req.cookies, "params": req.params, "query": req.query, "session": req.session, "body": req.body }));
};

fluid.defaults("fluid.test.express.middleware.reqview", {
    gradeNames: ["fluid.express.middleware"],
    invokers: {
        middleware: {
            funcName: "fluid.test.express.middleware.reqview.middleware",
            args:     ["{arguments}.0", "{arguments}.1"] // request, response
        }
    }
});
