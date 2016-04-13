/*

    A router which passes a request to different handlers based on what the request accepts.  See the documentation for
    details:

    https://github.com/GPII/gpii-express/blob/master/docs/contentAwareRouter.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./requestAwareMiddleware");

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
gpii.express.middleware.contentAware.delegateToHandler = function (that, request, response) {
    var handlerGrades = gpii.express.middleware.contentAware.getHandlerGradesByContentType(that, request);
    if (handlerGrades) {
        that.events.onRequest.fire(request, response, handlerGrades);
    }
    else {
        response.status(500).send({ok: false, message: "Could not find an appropriate handler for the content types you accept."});
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
    var orderedHandlers = gpii.express.orderByPriority(that.options.handlers);
    var matchingHandler = fluid.find(orderedHandlers, function (value) {
        return Boolean(value.contentType && request.accepts(value.contentType)) ? value : undefined;
    });

    return matchingHandler ? matchingHandler.handlerGrades : undefined;
};

fluid.defaults("gpii.express.middleware.contentAware", {
    gradeNames: ["gpii.express.middleware"],
    timeout: 5000,
    distributeOptions: {
        source: "{that}.options.timeout",
        target: "{that gpii.express.handler}.options.timeout"
    },
    events: {
        onRequest: null
    },
    dynamicComponents: {
        requestHandler: {
            type:          "gpii.express.handler",
            createOnEvent: "onRequest",
            options: {
                gradeNames: "{arguments}.2",
                request:    "{arguments}.0",
                response:   "{arguments}.1"
            }
        }
    },
    invokers: {
        middleware: {
            funcName: "gpii.express.middleware.contentAware.delegateToHandler",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});
