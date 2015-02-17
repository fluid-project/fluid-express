// Base grade for express router modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into its routing table.

var fluid     = fluid || require('infusion');
var namespace = "gpii.express.router";
var router    = fluid.registerNamespace(namespace);

router.createRouter = function(that) {
    if (!that.options.config || !that.options.config.express) {
        console.error("Can't instantiate router without a working config object.")
        return null;
    }

    var express       = require("express");
    that.applier.change("router", express.Router());

    that.events.routerLoaded.fire();
};

router.loadMiddleware = function(that) {
    if (!that.model.router) {
        console.log("Can't wire in child modules unless I have a router module.");
        return;
    }

    if (!that.options.path) {
        console.log("Can't wire in child modules without knowing my own path.");
        return;
    }

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
        });
    }
};

fluid.defaults(namespace, {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    path: null,
    config: "{gpii.express}.options.config",
    model: {
        router: null
    },
    events: {
        addRoutes:       null,
        routerLoaded:    null
    },
    listeners: {
        "onCreate": {
            funcName: namespace + ".createRouter",
            args: ["{that}"]
        },
        routerLoaded: [
            {
                "funcName": namespace + ".loadMiddleware",
                "args": "{that}"
            }
        ]
    }
});
