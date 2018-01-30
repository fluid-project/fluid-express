/*

    A helper function to diagram all routes in a `gpii.express` instance.

 */

"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.test.express");

/**
 *
 * Diagram all routes within an express instance.
 *
 * @param expressComponent {Object} A `gpii.express` component.
 * @return {Object} A JSON Object representing all routes within a `gpii.express` instance.
 *
 */
gpii.test.express.diagramAllRoutes = function (expressComponent) {
    return gpii.test.express.diagramOneLevel(expressComponent, expressComponent.router._router);
};

/**
 *
 * Diagram the routes for a single component.  To preserve the routing order of the stack, each level's children
 * are represented in a `children` Array.
 *
 * @param component {Object} A `gpii.express.middleware` component.
 * @param router {Object} The router instance within the component (if there is one).
 * @return {Object} A JSON Object representing the routes from this level down as well as the method and path for this level.
 */
gpii.test.express.diagramOneLevel = function (component, router) {
    var thisLevel = fluid.filterKeys(component.options, ["method", "path"]);
    thisLevel.typeName = component.typeName;

    if (router) {
        thisLevel.children = fluid.transform(router.stack, function (layer) {
            // This is a `gpii.express.router` instance
            if (layer.handle && layer.handle.that) {
                return gpii.test.express.diagramOneLevel(layer.handle.that, layer.handle.that.router);
            }
            // This is a `gpii.express.middleware` instance
            else if (layer.route) {
                var wrapper = fluid.filterKeys(layer.route, ["path", "methods"]);
                wrapper.children = fluid.transform(layer.route.stack, function (middlewareLayer) {
                    return gpii.test.express.diagramOneLevel(middlewareLayer.handle.that, middlewareLayer.handle.that.router);
                });
                return wrapper;
            }
            // This is something outside of our scope (i.e. native middleware).
            else {
                return "Native middleware '" + (layer.name || "unknown") + "'";
            }
        });
    }

    return thisLevel;
};
