// Sample "Hello World" router module
"use strict";
var namespace  = "gpii.express.tests.router.hello";
var fluid      = fluid || require('infusion');
var gpii       = fluid.registerNamespace("gpii");
var testRouter = fluid.registerNamespace(namespace);

testRouter.addRoutesPrivate = function(that) {
    if (!that.options.path) {
        console.log("You must configure a model.path for a gpii.express.router grade...");
        return null;
    }

    that.model.router.get(that.options.path, function(req,res) {
        res.status(200).send(that.options.message);
    });
};

fluid.defaults(namespace, {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.router", "autoInit"],
    path:    "/hello",
    message: "Hello, World",
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