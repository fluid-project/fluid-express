// Express instance represented as a component
//
// Add additional routers and middleware as child components of this module
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express");

gpii.express.registerRouter = function(routerComponent, expressComponent) {
    expressComponent.options.routersToLoad.push(routerComponent.options.router);
};

gpii.express.registerMiddleware = function(childComponent, expressComponent) {
    expressComponent.options.middlewareToLoad.push(childComponent.getMiddlewareFunction());
};

gpii.express.init = function(that) {
    if (!that.options.config || !that.options.config.express) {
        console.error("Cannot initialize express because you have not supplied a 'config' option.");
        return;
    }

    var express  = require("express");
    that.express = express();

    for (var a = 0; a < that.options.middlewareToLoad.length; a++){
        that.express.use(that.options.middlewareToLoad[a]);
    }

    for (var b = 0; b < that.options.routersToLoad.length; b++) {
        // router modules set their own paths internally, so we can mount them on the root safely
        that.express.use("/", that.options.routersToLoad[b]);
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
    middlewareToLoad: [],
    routersToLoad:    [],
    path: "/",
    express: null,
    distributeOptions:[
        {
            record: {
                "funcName": "gpii.express.registerRouter",
                "args": ["{arguments}.0", "{gpii.express}"]
            },
            target: "{that > gpii.express.router}.options.listeners.routerLoaded"
        },
        {
            record: {
                "funcName": "gpii.express.registerMiddleware",
                "args": ["{arguments}.0", "{gpii.express}"]
            },
            target: "{that > gpii.express.middleware}.options.listeners.onCreate"
        }
    ],
    events: {
        started:  null,
        stopped:  null
    },
    listeners: {
        onCreate: [
            {
                "funcName": "gpii.express.init",
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

