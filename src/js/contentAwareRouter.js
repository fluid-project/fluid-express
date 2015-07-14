// A router which passes a request to different handlers based on the content type.
//
// To use this grade, you are expected to provide `options.handlers`, with data as follows:
//
// handlers: {
//   json: {
//     contentType: "application/json",
//     gradeNames:  "singleGrade"
//   },
//   text: {
//     contentType: ["text/html", "text/plain"]
//     gradeNames:  ["oneGrade", "anotherGrade"]
//   }
// }
//
// The `Accepts` headers supplied by the user will be tested using `request.accepts(contentType)`.  The first
// `contentType` that matches will be used.  If no `Accepts` headers are provided, any contentType will match, and
// hence the first handler will be used.   Thus, you should add handlers in the order you would prefer that they are
// used.
//
// When the decision has been made and a match has been found, a component with the list of supplied `gradeNames`
// will be created to handle the request.  At least one of the gradeNames should extend the `requestAware.request`
// grade, which is the base contract for this type of request delegation.
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
        // TODO: Construct the matching handler using `handler.gradeNames`.
        //handler(that.request, that.response);
    }
    else {
        that.sendResponse(500, {ok: false, message: "Could not find an appropriate handler for the content types you accept."});
    }
};

gpii.express.contentAware.request.firstMatchingHandler = function (request, handlers) {
    fluid.each(handlers, function (value) {
        if (value.handler && value.contentType && request.accepts(value.contentType)) {
            return value.handler;
        }
    });

    return null;
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
