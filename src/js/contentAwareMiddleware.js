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
 * @param that {Object} The router component itself.
 * @param request {Object} The Express {Request} object.
 * @param response {Object} The Express {Response} object.
 * 
 */
gpii.express.middleware.contentAware.delegateToHandler = function (that, request, response, next) {
    var handlerGrades = gpii.express.middleware.contentAware.getHandlerGradesByContentType(that, request);
    if (handlerGrades) {
        var options = { gradeNames: handlerGrades };
        that.events.onRequest.fire(options, request, response); // options, request, response
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
 * @param that {Object} The router component itself.
 * @param request {Object} The Express {Request} object.
 * @returns {Array} An array of handler grades that will be used to create our handler.
 * 
 */
gpii.express.middleware.contentAware.getHandlerGradesByContentType = function (that, request) {
    var orderedHandlers = fluid.parsePriorityRecords(that.options.handlers, "Content aware entry");

    // Filter to handlersthat either have no contentType ("all content types") or that match the request.
    var matchingHandler = fluid.find(orderedHandlers, function (value) {
        return (!value.contentType || request.accepts(value.contentType)) ? value : undefined;
    });

    return matchingHandler ? matchingHandler.handlerGrades : undefined;
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
