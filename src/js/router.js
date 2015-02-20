// Base grade for express router modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into its routing table.
//
// This implementation is not meant to be used directly.  You must extend this grade and implement addRoutes() properly
//
// See the tests for an example.

var fluid = fluid || require('infusion');
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.router");

// Instantiate our router, which contains the path handling function we ourselves provide as well as those of any child router components we have.
gpii.express.router.createRouter = function(that) {
    if (!that.options.config || !that.options.config.express) {
        console.error("Can't instantiate router without a working config object.")
        return null;
    }

    var express         = require("express");
    that.options.router = express.Router();

    for (var a = 0; a < that.options.middlewareToLoad.length; a++){
        that.options.router.use(that.options.middlewareToLoad[a]);
    }

    // TODO:  Remove this once we have a working approach to avoid crawling through our components
    if (that.options.components) {
        var keys = Object.keys(that.options.components);
        for (var z = 0; z < keys.length; z++) {
            var component = that[keys[z]];
            if (fluid.hasGrade(component.options, "gpii.express.router")) {
                that.options.router.use(that.options.path, component.options.router);
            }
        }
    }

    //for (var b = 0; b < that.options.routersToLoad.length; b++) {
    //    // router modules set their own paths internally, so we can mount them on the root safely
    //    that.options.router.use(that.options.path, that.options.routersToLoad[b]);
    //}

    // Load ourselves last to avoid clobbering our children
    that.options.router.use(that.options.path, that.getRouterFunction());

    that.events.routerLoaded.fire(that);
};

// We will likely not have our routing infrastructure in place when our subcomponents are created, so we store them until we're ready.
gpii.express.router.registerRouter = function(childRouterComponent, routerComponent) {
    routerComponent.options.routersToLoad.push(childRouterComponent.options.router);
};


// We will likely not have our routing infrastructure in place when our subcomponents are created, so we store them until we're ready.
gpii.express.router.registerMiddleware = function(childMiddlewareComponent, parentRouterComponent) {
    parentRouterComponent.options.middlewareToLoad.push(childMiddlewareComponent.getMiddlewareFunction());
};

// If a working getRouterFunction() is not found, someone has not properly implemented their grade.
gpii.express.router.complainAboutMissingFunction = function(that) {
    throw(new Error("Your grade must have an getRouterFunction() invoker."));
};

fluid.defaults("gpii.express.router", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    path: null,
    middlewareToLoad: [],
    routersToLoad:    [],
    config: "{gpii.express}.options.config",
    distributeOptions:[
        // TODO:  Talk this through with Antranig and come up with a better solution
        //
        //{
        //    source: {
        //        "funcName": "gpii.express.router.registerRouter",
        //        "args": ["{arguments}.0", "{that}"]
        //    },
        //    target: "{gpii.express.router}.options.routersToLoad"
        //},
        {
            record: {
                "funcName": "gpii.express.router.registerMiddleware",
                "args": ["{arguments}.0", "{gpii.express.router}"]
            },
            target: "{that > gpii.express.middleware}.options.listeners.onCreate"
        }
    ],
    router: null,
    events: {
        addRoutes:       null,
        routerLoaded:    null
    },
    invokers: {
        "getRouterFunction": {
            "funcName": "gpii.express.router.complainAboutMissingFunction",
            args: ["{that}"]
        }
    },
    listeners: {
        "onCreate": {
            funcName: "gpii.express.router.createRouter",
            args: ["{that}"]
        }
    }
});
