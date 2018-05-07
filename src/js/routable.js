/*

    A base grade for things like a router and express itself, which contain other middleware components.

    https://github.com/GPII/gpii-express/blob/master/docs/routable.md

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.routable");

// TODO: Discuss if / how / when to pull this up into Infusion itself.
/**
 *
 * Return a map of immediate child components that extend `grade`.
 *
 * @param {Object} that - The component itself.
 * @param {String} grade - The gradename to search for.
 * @return {Object} - A map of child components that extend `grade`, keyed by member name.
 *
 */
gpii.express.routable.childrenWithGrade = function (that, grade) {
    var componentsMatchingGrade = {};
    fluid.visitComponentChildren(that, function (childComponent, name) {
        if (fluid.componentHasGrade(childComponent, grade)) {
            componentsMatchingGrade[name] = childComponent;
        }
    }, { flat: true });
    return componentsMatchingGrade;
};

/**
 *
 * Order an array of components using their `namespace` and `priority` options.
 *
 * @param {Object} unsortedComponentMap - A map of components to be sorted.
 * @return {Array} - The components, sorted by namespaced priority.
 *
 */
gpii.express.routable.prioritiseComponentArray = function (unsortedComponentMap)  {
    var componentOptionsById = {};
    fluid.each(unsortedComponentMap, function (singleComponent, memberName) {
        var optionsForPrioritySorting = fluid.copy(singleComponent.options);
        optionsForPrioritySorting.pocketedComponent = singleComponent;
        componentOptionsById[memberName] = optionsForPrioritySorting;
    });
    var sortedComponentOptions = fluid.parsePriorityRecords(componentOptionsById, "router entry");
    var sortedComponents = fluid.getMembers(sortedComponentOptions, "pocketedComponent");
    return sortedComponents;
};

/**
 *
 * @param {Object} that - The `gpii.express.routable` instance itself.
 *
 * Wire our immediate child middleware into our router.
 *
 */
gpii.express.routable.connectDirectDescendants = function (that) {
    if (that.router) {
        var childMiddlewareComponents = gpii.express.routable.childrenWithGrade(that, "gpii.express.middleware");
        var childMiddlewareComponentsOrderedByPriority = gpii.express.routable.prioritiseComponentArray(childMiddlewareComponents);
        fluid.each(childMiddlewareComponentsOrderedByPriority, function (childComponent) {
            fluid.each(fluid.makeArray(childComponent.options.method), function (methodName) {
                that.router[methodName](childComponent.options.path, childComponent.getMiddlewareFn());
            });
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

