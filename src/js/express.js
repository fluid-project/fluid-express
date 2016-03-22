// An [Express.js](http://expressjs.com/) instance represented as a Fluid component.
//
// By default, this instance does nothing useful.  Your instance will need to add at least one `gpii.express.router`
// or `gpii.express.middleware` child component that will respond to incoming requests.  See those grades for more
// details.
//
// Express configuration options are set using `options.config.express`.  The `options.config.express.views` variable
// has special meaning for template renderers like `gpii-handlebars`.  It represents one or more directories containing
// template subdirectories (`layouts`, `pages`, and `partials`). You may either have a single string value, or an array
// of values.
//
// Each value will be passed through `fluid.model.resolvePath`, so that references to Fluid component packages can
// be resolved relative to where they are installed, regardless of whether they are immediate or inherited dependencies.
// You should be using these references, which generally are of the form `%npm-package-name/path/within/package`.
//
// See the `gpii-handlebars` package for more details about view directories.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
require("./configholder");

var express  = require("express");

fluid.registerNamespace("gpii.express");

// Sort an array or map by `priority`: http://docs.fluidproject.org/infusion/development/Priorities.html
//
// As maps do not preserve order, an array will be returned.  When used with a map, the keys will be discarded.
//
gpii.express.orderByPriority = function (map) {
    var array = fluid.hashToArray(map, "namespace", function (newEl, el) {
        newEl = fluid.censorKeys(el, ["priority"]);
        newEl.priority = fluid.parsePriority(el.priority, 0, false);
        return newEl;
    });
    fluid.sortByPriority(array);
    return array;
};

// Look up the path (parent, sibling, child) relationships for a node.
// Used in constructing the hierarchy we will use to wire together everything in our onCreate method.
//
// This does not require an invoker as it is basically a static method.
gpii.express.pathForComponent = function (that) {
    var instantiator  = fluid.getInstantiator(that);
    var path          = instantiator.idToPath(that.id);

    return fluid.model.parseEL(path);
};

// Make a note of the lineage of this middleware or router component, all the way back presumably to this gpii.express
// instance itself.
//
// This information will be used to wire together all nested routers and any middleware dependencies they have.
gpii.express.registerComponentLineage = function (childComponent, expressComponent) {
    // Get the list of parents for this component
    var segments = gpii.express.pathForComponent(childComponent);

    var childNickname  = segments[segments.length - 1];

    var expressSegments = gpii.express.pathForComponent(expressComponent);

    // If we only have one segment more than express, we are a child of express itself.
    // We need this to be able to handle cases in which express itself is a child component.
    if (segments.length === expressSegments.length + 1) {
        expressComponent.directChildrenOfInterest.push(childNickname);
    }
    // Otherwise, register the nickname of this component and its immediate parent path, each level will take care of the next highest.
    else if (segments.length > expressSegments.length + 1) {
        var parentPath = segments.slice(expressSegments.length, segments.length - 1).join(".");
        if (expressComponent.childrenByParent[parentPath]) {
            expressComponent.childrenByParent[parentPath].push(childNickname);
        }
        else {
            expressComponent.childrenByParent[parentPath] = [childNickname];
        }
    }
};

// Wire a child to its immediate descendants.
gpii.express.connectDirectDescendants = function (that, component, path) {
    var descendants =  that.childrenByParent[path];

    // This component has descendants, wire them in first
    if (descendants !== undefined) {
        // Wire together one level of routers and middleware, then recurse
        for (var a = 0; a < descendants.length; a++) {
            var childNickname  = descendants[a];
            var childComponent = component[childNickname];
            if (fluid.hasGrade(childComponent.options, "gpii.express.router")) {
                // We have to wire our children in with our path to preserve relative pathing, so that their router will begin with our path.
                component.router.use(component.options.path, childComponent.router);

                // Recurse from here on down.
                that.connectDirectDescendants(childComponent, path + "." + childNickname);
            }
            else if (fluid.hasGrade(childComponent.options, "gpii.express.middleware")) {
                if (component.router) {
                    // We have to wire our children in with our path to preserve relative pathing, so that their router will begin with our path.
                    component.router.use(component.options.path, childComponent.checkMethod);
                }
                else {
                    fluid.fail("A component must expose a router in order to work with child middleware components.");
                }
            }
        }
    }

    // After our child components are in place, wire the router to itself.
    //
    // This must be done here because we want to give children the chance to own part of the path before we take the rest over.
    //
    // The path and method have to be used here so that parameters will be parsed correctly.
    if (fluid.hasGrade(component.options, "gpii.express.router")) {
        component.router[component.options.method](component.options.path, component.route);
    }
};

gpii.express.init = function (that) {
    if (!that.options.config || !that.options.config.express) {
        console.error("Cannot initialize express because you have not supplied a 'config' option.");
        return;
    }

    that.express = express();

    // Wire together all routers and components, beginning with ourselves
    for (var a = 0; a < that.directChildrenOfInterest.length; a++) {
        var directChildNickname = that.directChildrenOfInterest[a];
        var childComponent      = that[directChildNickname];
        if (fluid.hasGrade(childComponent.options, "gpii.express.router")) {
            // The router has to wire its own paths to preserve methods and path variables.
            // We just "use" it at the root level, and let it do the rest.
            that.express.use("/", childComponent.router);
        }
        else if (fluid.hasGrade(childComponent.options, "gpii.express.middleware")) {
            that.express.use(childComponent.middleware);
        }

        // Recurse from here on down.
        that.connectDirectDescendants(childComponent, directChildNickname);
    }

    var port = that.options.config.express.port;
    that.express.set("port", port);
    that.server = that.express.listen(port, function () {
        fluid.log("Express server listening on port " + that.express.get("port"));

        fluid.log("Express started...");
        that.events.onStarted.fire(that.express, that);
    });
};

gpii.express.stopServer = function (that) {
    that.server.close(function () {
        fluid.log("Express stopped...");
        that.events.onStopped.fire();
    });
};

// Resolve any package references (e. g. `%package-name/path/within/package/`)
gpii.express.expandPaths = function (views) {
    return fluid.transform(fluid.makeArray(views), fluid.module.resolvePath);
};

fluid.defaults("gpii.express", {
    gradeNames: ["fluid.modelComponent", "gpii.express.expressConfigHolder"],
    members: {
        directChildrenOfInterest: [],
        childrenByParent:         {},
        views: "@expand:gpii.express.expandPaths({that}.options.config.express.views)"
    },
    path: "/",
    express: null,
    distributeOptions: [
        {
            record: {
                "funcName": "gpii.express.registerComponentLineage",
                "args": ["{arguments}.0", "{gpii.express}"]
            },
            target: "{that gpii.express.router}.options.listeners.routerLoaded"
        },
        {
            record: {
                "funcName": "gpii.express.registerComponentLineage",
                "args": ["{arguments}.0", "{gpii.express}"]
            },
            target: "{that gpii.express.middleware}.options.listeners.onCreate"
        }
    ],
    invokers: {
        "connectDirectDescendants" : {
            "funcName": "gpii.express.connectDirectDescendants",
            "args":     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    },
    events: {
        onStarted:  null,
        onStopped:  null
    },
    listeners: {
        onCreate:
        {
            "funcName": "gpii.express.init",
            "args":     "{that}"
        },
        "onDestroy.stopServer":
        {
            funcName: "gpii.express.stopServer",
            args:     ["{that}"]
        }
    }
});

