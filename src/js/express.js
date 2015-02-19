// Express instance represented as a component
//
// Add additional routers and middleware as child components of this module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express");

gpii.express.init = function(that) {
    if (!that.options.config || !that.options.config.express) {
        console.error("Cannot initialize express because you have not supplied a 'config' option.");
        return;
    }

    var express  = require("express");
    that.express = express();
    that.router = express.Router();
    that.express.use(that.options.path, that.router);

    var helpersToLoad = [];
    if (that.options.components) {
        // Any child components with the grade {gpii.express.router} will be wired in and then added to our routing
        Object.keys(that.options.components).forEach(function(key) {
            var component = that[key];
            if (fluid.hasGrade(component.options, "gpii.express.router")) {
                component.events.addRoutes.fire();
                that.router.use(that.options.path, component.model.router);
            }
            else if (fluid.hasGrade(component.options, "gpii.express.middleware")) {
                if (component.model.middleware) {
                    var middlewareToLoad = Array.isArray(component.model.middleware) ? component.model.middleware : [component.model.middleware];
                    for (var i = 0; i < middlewareToLoad.length; i++) {
                        var functionName = middlewareToLoad[i];
                        if (component[functionName]) {
                            try {
                                that.router.use(component[functionName]);
                            }
                            catch (e) {
                                console.error("Error loading middleware function '" + functionName + "' in module '" + key + "':" + e);
                            }
                        }
                        else {
                            console.error("Middleware '" + functionName + "' does not exist in module '" + key + "'...");
                        }
                    }
                }
                else {
                    console.log("Middleware module has no middleware to load, can't continue...");
                }
            }
            else if (fluid.hasGrade(component.options, "gpii.express.helper")) {
                var helpers = component.getHelpers();
                Object.keys(helpers).forEach(function(key){
                    if (helpersToLoad[key]) {
                        console.error("Another module has already loaded a helper named '" + key + "'. This instance will not be enabled.");
                    }
                    else {
                        helpersToLoad[key] = helpers[key];
                    }
                });
            }
        });
    }

    that.express.set("port", that.options.config.express.port);
    that.server = that.express.listen(that.options.config.express.port, function(){
        console.log("Express server listening on port " + that.express.get("port"));

        console.log("Express started...");
        that.events.started.fire(that.express);
    });
};

gpii.express.stopServer = function(that) {
    that.server.close(function(){
        console.log("Express stopped...");
        that.events.stopped.fire();
    });
};

fluid.defaults("gpii.express", {
    gradeNames: ["fluid.standardRelayComponent", "autoInit"],
    path: "/",
    router:  null,
    express: null,
    events: {
        started:  null,
        stopped:  null
    },
    invokers: {
        "init": {
            funcName: "gpii.express.init"
        }
    },
    listeners: {
        onCreate: [
            {
                "funcName": "{express}.init",
                "args": "{that}"
            }
        ],
        onDestroy: [
            {
                funcName: "gpii.express.stopServer",
                args: ["{that}"]
            }
        ]
    }
});

