// A router which delivers different types of content based on the content type.
//
// To use this grade, you are expected to provide `options.handlers`, with data as follows:
//
// handlers: {
//   json: {
//     contentType: "application/json",
//     handler:     "{that}.jsonInvoker"
//   },
//   text: {
//     contentType: "text",
//     handler:     "{that}.textInvoker"
//   }
// }
//
// The `Accepts` headers supplied by the user will be tested using `request.accepts(contentType)`.  The first
// `contentType` that matches will be used.  If no `Accepts` headers are provided, any contentType will match, and
// hence the first handler will be used.   Thus, you should add handlers in the order you would prefer that they are
// used.
//
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.setLogging(true);
require("./requestAwareRouter");

fluid.registerNamespace("gpii.express.contentAware.request");
gpii.express.contentAware.request.delegateToHandler = function (that) {
    var handler = gpii.express.contentAware.request.firstMatchingHandler(that.request, that.options.handlers);
    if (handler) {
        handler(that.request, that.response);
    }
    else {
        that.sendResponse(500, {ok: false, message: "Could not find an appropriate handler for the content types you accept."});
    }
};

gpii.express.contentAware.request.firstMatchingHandler = function (request, handlers) {
    var handler = null;
    fluid.each(handlers, function (value) {
        if (!handler && value.handler && value.contentType && request.accepts(value.contentType)) {
            handler = value.handler;
        }
    });

    return handler;
};

fluid.defaults("gpii.express.contentAware.request", {
    gradeNames: ["gpii.express.requestAware"],
    handlers: {},
    listeners: {
        "onCreate.delegateToHandler": {
            funcName: "gpii.express.contentAware.request.delegateToHandler",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.contentAware.router", {
    gradeNames:         ["gpii.express.requestAware.router", "autoInit"],
    requestAwareGrades: ["gpii.express.contentAware.request"]
});
