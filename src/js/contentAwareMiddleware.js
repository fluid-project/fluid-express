/*

    A router which passes a request to different handlers based on what the request accepts.  See the documentation for
    details:

    https://github.com/GPII/gpii-express/blob/master/docs/contentAwareMiddleware.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./handler");

fluid.registerNamespace("gpii.express.middleware.contentAware");

/**
 *
 * Handle all traffic routed to us.  Locate an appropriate handler if possible, return a clear error if not.
 *
 * @param {Object} that - The router component itself.
 * @param {Object} request - The Express {Request} request - object.
 * @param {Object} response - The Express {Response} response - object.
 * @param {Function} next - The next piece of middleware in the chain.
 *
 */
gpii.express.middleware.contentAware.delegateToHandler = function (that, request, response, next) {
    var handlerGrades = gpii.express.middleware.contentAware.getHandlerGradesByContentType(that, request);
    if (handlerGrades) {
        var options = { gradeNames: handlerGrades };
        that.events.onRequest.fire(options, request, response, next); // options, request, response, next
    }
    else {
        next({ isError: true, message: that.options.messages.noHandlerFound });
    }
};

/**
 *
 * Return the first matching handler that matches the `request` object's `accept` header.  Handlers are sorted by
 * priority before they are evaluated.
 *
 * @param {Object} that - The router component itself.
 * @param {Object} request - The Express {Request} request - object.
 * @return {Array} An array of handler grades that will be used to create our handler.
 *
 */
gpii.express.middleware.contentAware.getHandlerGradesByContentType = function (that, request) {
    var orderedHandlers = fluid.parsePriorityRecords(that.options.handlers, "Content aware entry");

    // First, compile the whole list of possible content types.
    var allContentTypes = [];
    fluid.each(orderedHandlers, function (handlerEntry) {
        if (handlerEntry.contentType) {
            allContentTypes = allContentTypes.concat(fluid.makeArray(handlerEntry.contentType));
        }
    });

    var bestMatch = request.accepts(allContentTypes);

    // One of the handlers can work with the request, figure out which one it is.
    if (bestMatch) {
        // Filter to handlers that either have no contentType ("all content types") or that match the request.
        var matchingHandler = fluid.find(orderedHandlers, function (value) {
            return (fluid.makeArray(value.contentType).indexOf(bestMatch) !== -1) ? value : undefined;
        });

        return matchingHandler ? matchingHandler.handlerGrades : undefined;
    }
    // We have no matching handler.
    else {
        return undefined;
    }
};

fluid.defaults("gpii.express.middleware.contentAware", {
    gradeNames: ["gpii.express.middleware", "gpii.express.handlerDispatcher"],
    messages: {
        noHandlerFound: "Could not find an appropriate handler for the content types you accept."
    },
    invokers: {
        middleware: {
            funcName: "gpii.express.middleware.contentAware.delegateToHandler",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
        }
    }
});
