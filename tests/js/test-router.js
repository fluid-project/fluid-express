// Sample "Hello World" router module
"use strict";
var fluid = fluid || require('infusion');
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.router.hello");

gpii.express.tests.router.hello.addRoutesPrivate = function(that) {
    if (!that.options.path) {
        console.log("You must configure a model.path for a gpii.express.router grade...");
        return null;
    }

    that.model.router.get(that.options.path, function(req,res) {
        res.status(200).send(that.options.message);
    });
};

fluid.defaults("gpii.express.tests.router.hello", {
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
            funcName: "gpii.express.tests.router.hello.addRoutesPrivate",
            args: ["{that}"]
        }
    }
});