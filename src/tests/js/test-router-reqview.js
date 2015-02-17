// Test router module to expose the "req" object so that we can confirm that our middleware is installed correctly.
"use strict";
var namespace = "gpii.express.tests.router.reqview";
var fluid     = fluid || require('infusion');
var gpii      = fluid.registerNamespace("gpii");
var reqView   = fluid.registerNamespace(namespace);

reqView.addRoutesPrivate = function(that) {
    if (!that.options.path) {
        console.log("You must configure a path for a gpii.express.router grade...");
        return null;
    }

    that.model.router.use(that.options.path, function(req,res) {
        req.session.lastAccess = new Date();
        res.status(200).send(JSON.stringify({"cookies": req.cookies, "params": req.params, "query": req.query, "session": req.session, "body": req.body }));
    });
};

fluid.defaults(namespace, {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.router", "autoInit"],
    path:    "/reqview",
    model: {
        router:  null
    },
    events: {
        addRoutes: null
    },
    listeners: {
        "addRoutes": {
            funcName: namespace + ".addRoutesPrivate",
            args: ["{that}"]
        }
    }
});