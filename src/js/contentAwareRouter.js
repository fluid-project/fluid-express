// A router which passes a request to different handlers based on the content type.  A handler is itself an
// `RequestAwareRouter`, and will construct whatever components are needed to handle the underlying request.
//
// To use this grade, you must:
//
// 1. Add each `RequestAwareRouter` grade you need to your components.
// 2. Create a map indicating which content types should be handled by which router, as in:
//
// handlers: {
//   json: {
//     contentType: "application/json",
//     handler:     "{that}.component1"
//   },
//   text: {
//     contentType: ["text/html", "text/plain"]
//     handler:     "{that}.component2"
//   }
// }
//
// The `Accepts` headers supplied by the user will be tested using `request.accepts(contentType)`.  The first
// `contentType` that matches will be used.  If no `Accepts` headers are provided, any contentType will match, and
// hence the first handler will be used.   Thus, you should add handlers in the order you would prefer that they are
// used.
//
// When the decision has been made and a match has been found, the request will be serviced by the
// appropriate `RequestAwareRouter` component.
//
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./requestAwareRouter");

fluid.registerNamespace("gpii.express.contentAware.router");
gpii.express.contentAware.router.delegateToHandler = function (that, request, response) {
    var handler = gpii.express.contentAware.router.firstMatchingHandler(that, request, that.options.handlers);
    if (handler) {
        handler.events.onRequest.fire(request, response);
    }
    else {
        response.status(500).send({ok: false, message: "Could not find an appropriate handler for the content types you accept."});
    }
};

gpii.express.contentAware.router.firstMatchingHandler = function (that, request, handlers) {
    var handler = null;
    fluid.each(handlers, function (value) {
        if (!handler && value.handler && value.contentType && Boolean(request.accepts(value.contentType))) {
            handler = value.handler;
        }
    });

    return handler;
};

gpii.express.contentAware.router.getRouter = function (that) {
    return that.delegateToHandler;
};

fluid.defaults("gpii.express.contentAware.router", {
    gradeNames: ["gpii.express.router", "autoInit"],
    // Our child handlers will be asked to handle requests outside of the normal routing mechanism.
    // The next few lines are required to prevent routers whose `path` is `/` from hiding our own response.
    nonsensePath: "/gibberish",
    distributeOptions: [
        {
            source: "{that}.options.nonsensePath",
            target: "{that > gpii.express.router}.options.path"
        }
    ],
    invokers: {
        getRouter: {
            funcName: "gpii.express.contentAware.router.getRouter",
            args:     ["{that}"]
        },
        delegateToHandler: {
            funcName: "gpii.express.contentAware.router.delegateToHandler",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});
