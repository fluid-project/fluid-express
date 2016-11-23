/*

    A base grade for things like a router and express itself, which contain other middleware components.

    https://github.com/GPII/gpii-express/blob/master/docs/routable.md

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.routable");

/**
 *
 * @param that {Object} - The `gpii.express.routable` instance itself.
 *
 * Wire our immediate child middleware into our router.
 *
 */
gpii.express.routable.connectDirectDescendants = function (that) {
    if (that.router) {
        // We have to look at `that.options.components` and iterate through them because we cannot safely inject
        // a registration function from one instance of `gpii.express.routable` to another.  Previously we worked
        // around this by having `gpii.express` (a singleton) inject its function into every `gpii.express.middleware`
        // instance.  This new approach allows for multiple express instances and simplifies the infrastructure greatly.

        // We need to preserve the existing component names (keys) as part of the individual record before we can
        // safely order them by `priority` and `namespace`.
        var componentDefinitionsWithNicks = fluid.transform(that.options.components, function (componentDef, key) {
            var modifiedOptions = fluid.copy(componentDef.options || {});
            modifiedOptions.pocketedKey = key;
            return modifiedOptions;
        });

        fluid.each(fluid.parsePriorityRecords(componentDefinitionsWithNicks, "router entry"), function (componentDef) {
            var childComponent = that[componentDef.pocketedKey];
            if (fluid.componentHasGrade(childComponent, "gpii.express.middleware")) {
                fluid.each(fluid.makeArray(childComponent.options.method), function (methodName) {
                    that.router[methodName](childComponent.options.path, childComponent.getMiddlewareFn());
                });
            }
        });

        that.events.onChildrenWired.fire(that);
    }
    else {
        fluid.fail("You must provide a top-level router (express or router) to use this grade.");
    }
};

fluid.defaults("gpii.express.routable", {
    gradeNames: ["fluid.component"],
    events: {
        onReadyToWireChildren: null,
        onChildrenWired:       null
    },
    childMiddleware: [],
    listeners: {
        onReadyToWireChildren: {
            "funcName": "gpii.express.routable.connectDirectDescendants",
            "args":     ["{that}"]
        }
    }
});

