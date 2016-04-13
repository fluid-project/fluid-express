/*

    An [Express.js](http://expressjs.com/) instance represented as a Fluid component.  See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/express.md

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var express  = require("express");

fluid.registerNamespace("gpii.express");

/**
 *
 * @param mapOrArray {Object} - A map or array to be sorted.
 * @returns {Array} - An array of elements, ordered by namespace and priority.
 *
 * Sorts an array or map by `priority`: http://docs.fluidproject.org/infusion/development/Priorities.html
 *
 * As maps do not preserve order, an array is always returned.  When used with a map, the keys will be discarded.
 *
 */
gpii.express.orderByPriority = function (mapOrArray) {
    var array = fluid.hashToArray(mapOrArray, "namespace", function (newEl, el) {
        newEl = fluid.censorKeys(el, ["priority"]);
        newEl.priority = fluid.parsePriority(el.priority, 0, false);
        return newEl;
    });

    fluid.sortByPriority(array);
    return array;
};

/**
 *
 * @param that {Object} - The `gpii.express` instance itself.
 *
 * Look up the path (parent, sibling, child) relationships for a node.  Used in constructing the hierarchy we will
 * use to wire together everything in our init method.
 *
 */
gpii.express.pathForComponent = function (that) {
    var instantiator  = fluid.getInstantiator(that);
    var path          = instantiator.idToPath(that.id);

    return fluid.model.parseEL(path);
};

/**
 *
 * @param childComponent
 * @param expressComponent
 *
 * Make a note of the lineage of this middleware or router component, all the way back presumably to the `gpii.express`
 * instance itself.  This function is distributed as a listener to child `gpii.express.router` and
 * `gpii.express.middleware` components, which use it to register themselves.
 *
 * The registry gathered by this process will be used to wire together all nested routers and any middleware
 * dependencies they have.
 *
 */
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

/**
 *
 * @param entry {Object} - A single entry object, which is expected to contain a `nick` variable.
 * @returns {String} - The contents of the `nick` variable.
 *
 * Static function for use with `Array.prototype.map`.  Extracts just the "nick" variable from the structure we construct in `getOrderedNicknames`.
 *
 */
gpii.express.extractNicks = function (entry) {
    return entry.nick;
};

/**
 *
 * @param nicknames {Object} - An unordered array of "nicknames" representing children of a given component.
 * @param component {Object} - The component we will resolve the "nicknames" against.
 * @returns {Array} - An array that contains all of the original "nicknames", but ordered by priority and namespace.
 *
 * Start with the nicknames each child component registered with us and combine it with the relevant priority data to
 * produce an ordered array.
 *
 */
gpii.express.getOrderedNicknames = function (nicknames, component) {
    // Create an array that combines the "nicknames" in `that.childrenByParent[path]` with each component's hints about
    // `priority` and `namespace`.
    var nickNamesWithComponentPrioritiesAndNamespaces = [];
    fluid.each(nicknames, function (childNickname) {
        var childComponent = component[childNickname];
        nickNamesWithComponentPrioritiesAndNamespaces.push({ nick: childNickname, namespace: childComponent.options.namespace, priority: childComponent.options.priority });
    });

    // Order the combined data by priority so that we have predictable control over which is loaded when, then map it
    // back to a simple ordered array.
    return gpii.express.orderByPriority(nickNamesWithComponentPrioritiesAndNamespaces).map(gpii.express.extractNicks);
};

/**
 *
 * @param that {Object} - The `gpii.express` instance itself.
 * @param component {Object} - The component we are working with at this level.  As we are treeing down through a hierarchy, this will change depending on the level we're at.
 * @param path {String} - The path segment where we can fine the child components we need to wire in to ourselves.
 *
 * Wire a child component to its immediate descendants using the `use` method common to both `express` and all
 * middleware.
 *
 */
gpii.express.connectDirectDescendants = function (that, component, path) {
    var orderedNicknames = gpii.express.getOrderedNicknames(that.childrenByParent[path], component);

    // This component has descendants, wire them in first.
    fluid.each(orderedNicknames, function (childNickname) {
        var childComponent = component[childNickname];

        if (fluid.hasGrade(childComponent.options, "gpii.express.middleware")) {
            gpii.express.wireMiddlewareToContainer(component.router, childComponent);
        }

        if (fluid.hasGrade(childComponent.options, "gpii.express.router")) {
            // Recurse from here on down.
            that.connectDirectDescendants(childComponent, path + "." + childNickname);
        }
    });
};

gpii.express.wireMiddlewareToContainer = function (container, middlewareComponent) {
    if (fluid.hasGrade(middlewareComponent.options, "gpii.express.middleware")) {
        fluid.each(fluid.makeArray(middlewareComponent.options.method), function (methodName) {
            container[methodName](middlewareComponent.options.path, middlewareComponent.getMiddlewareFn());
        });
    }
};

/**
 *
 * @param that {Object} - The `gpii.express` component itself.
 *
 * Create, configure and start our internal instance of `express`.  Wire up all middleware and routers.
 *
 */
gpii.express.init = function (that) {
    if (!that.options.port) {
        fluid.fail("Cannot initialize express because you have not supplied a 'port' option.");
    }
    else {
        that.express = express();

        var orderedNicknames = gpii.express.getOrderedNicknames(that.directChildrenOfInterest, that);

        // Wire together all routers and components, beginning with ourselves
        // for (var a = 0; a < that.directChildrenOfInterest.length; a++) {
        fluid.each(orderedNicknames, function (directChildNickname) {
            var childComponent  = that[directChildNickname];

            gpii.express.wireMiddlewareToContainer(that.express, childComponent);

            // Recurse from here on down.
            that.connectDirectDescendants(childComponent, directChildNickname);
        });

        that.express.set("port", that.options.port);
        that.server = that.express.listen(that.options.port, function () {
            fluid.log("Express server listening on port " + that.express.get("port"));

            fluid.log("Express started...");
            that.events.onStarted.fire(that.express, that);
        });
    }
};

/**
 *
 * @param that {Object} = The `gpii.express` component itself.
 *
 * Stop our internal instance of `express` when our component is destroyed.
 *
 */
gpii.express.stopServer = function (that) {
    that.server.close(function () {
        fluid.log("Express stopped...");
        that.events.onStopped.fire();
    });
};

/**
 *
 * @param array {Object} - An array of strings.
 * @returns {Array} - A new array with all references resolved.  The order of elements is preserved.
 *
 * Resolves package references (e. g. `%package-name/path/within/package/`) in an array of strings, which are presumed
 * to represent filesystem paths.
 *
 */
gpii.express.expandPaths = function (array) {
    return fluid.transform(fluid.makeArray(array), fluid.module.resolvePath);
};

fluid.defaults("gpii.express", {
    gradeNames: ["fluid.modelComponent", "gpii.express.expressConfigHolder"],
    members: {
        directChildrenOfInterest: [],
        childrenByParent:         {}
    },
    path: "/",
    express: null,
    distributeOptions: [
        {
            record: {
                "funcName": "gpii.express.registerComponentLineage",
                "args": ["{arguments}.0", "{gpii.express}"]
            },
            target: "{that gpii.express.middleware}.options.listeners.onReady"
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

