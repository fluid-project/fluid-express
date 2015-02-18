// Express instance represented as a component
//
// Add additional routers and middleware as child components of this module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express");

var exphbs      = require("express-handlebars");
var handlebars  = require("handlebars");

gpii.express.initExpress = function(that) {
    if (!that.options.config || !that.options.config.express) {
        console.error("Cannot initialize express because you have not supplied a 'config' option.");
        return;
    }

    // We need these to be model variables so that other grades can listen and take action when they are changed.
    var express  = require("express");
    that.applier.change("express", express());
    that.applier.change("router", express.Router());
    that.model.express.use(that.options.path, that.model.router);

    var helpersToLoad = [];
    if (that.options.components) {
        // Any child components with the grade {gpii.express.router} will be wired in and then added to our routing
        Object.keys(that.options.components).forEach(function(key) {
            var component = that[key];
            if (fluid.hasGrade(component.options, "gpii.express.router")) {
                component.events.addRoutes.fire();
                that.model.router.use(that.options.path, component.model.router);
            }
            else if (fluid.hasGrade(component.options, "gpii.express.middleware")) {
                if (component.model.middleware) {
                    var middlewareToLoad = Array.isArray(component.model.middleware) ? component.model.middleware : [component.model.middleware];
                    for (var i = 0; i < middlewareToLoad.length; i++) {
                        var functionName = middlewareToLoad[i];
                        if (component[functionName]) {
                            try {
                                that.model.router.use(component[functionName]);
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

    if (that.options.config.express.views) {
        var viewRoot = that.options.config.express.views;
        var handlebarsConfig = {
            defaultLayout: "main",
            layoutsDir:    viewRoot + "/layouts/",
            partialsDir:   viewRoot + "/partials/"
        };

        if (helpersToLoad) {
            handlebarsConfig.helpers = helpersToLoad;
        }


        that.model.express.set("views", viewRoot);

        var hbs = exphbs.create(handlebarsConfig);
        that.model.express.engine("handlebars", hbs.engine);
        that.model.express.set("view engine", "handlebars");
    }
    else {
        console.error("Cannot initialize template handling without a 'config.express.views' option");
    }
};

gpii.express.startPrivate = function(that, callback) {
    if (!that.options.config || !that.options.config.express) {
        console.error("Cannot start express because you have not supplied a 'config' option.");
        return;
    }

    that.model.express.set("port", that.options.config.express.port);
    that.server = that.model.express.listen(that.options.config.express.port, function(){
        console.log("Express server listening on port " + that.model.express.get("port"));

        console.log("Express started...");
        that.events.expressStarted.fire();

        if (callback) {
            callback();
        }
    });
};

gpii.express.stopPrivate = function(that, callback) {
    that.server.close(callback);
};

fluid.defaults("gpii.express", {
    gradeNames: ["fluid.standardRelayComponent", "autoInit"],
    path: "/",
    model: {
        router:  null,
        express: null
    },
    events: {
        expressStarted:  null
    },
    invokers: {
        "init": {
            funcName: "gpii.express.initExpress"
        },
        start: {
            funcName: "gpii.express.startPrivate",
            args: ["{that}", "{arguments}.0"]
        },
        stop: {
            funcName: "gpii.express.stopPrivate",
            args: ["{that}", "{arguments}.0"]
        }
    },
    listeners: {
        onCreate: [
            {
                "funcName": "{express}.init",
                "args": "{that}"
            }
        ]
    }
});

