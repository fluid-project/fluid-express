/*

    A helper function to diagram all routes in a `fluid.express` instance.

 */

"use strict";
var fluid = fluid || require("infusion");

fluid.registerNamespace("fluid.test.express");

/**
 *
 * Diagram all routes within an express instance.
 *
 * @param {Object} expressComponent - A `fluid.express` component.
 * @return {Object} A JSON Object representing all routes within a `fluid.express` instance.
 *
 */
fluid.test.express.diagramAllRoutes = function (expressComponent) {
    return fluid.test.express.diagramOneLevel(expressComponent, expressComponent.router._router);
};

/**
 *
 * Diagram the routes for a single component.  To preserve the routing order of the stack, each level's children
 * are represented in a `children` Array.
 *
 * @param {Object} component - A `fluid.express.middleware` component.
 * @param {Object} router - The router instance within the component (if there is one).
 * @return {Object} A JSON Object representing the routes from this level down as well as the method and path for this level.
 */
fluid.test.express.diagramOneLevel = function (component, router) {
    var thisLevel = fluid.filterKeys(component.options, ["method", "path"]);
    thisLevel.typeName = component.typeName;

    if (router) {
        thisLevel.children = fluid.transform(router.stack, function (layer) {
            // This is a `fluid.express.router` instance
            if (layer.handle && layer.handle.that) {
                return fluid.test.express.diagramOneLevel(layer.handle.that, layer.handle.that.router);
            }
            // This is a `fluid.express.middleware` instance
            else if (layer.route) {
                var wrapper = fluid.filterKeys(layer.route, ["path", "methods"]);
                wrapper.children = fluid.transform(layer.route.stack, function (middlewareLayer) {
                    return fluid.test.express.diagramOneLevel(middlewareLayer.handle.that, middlewareLayer.handle.that.router);
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
