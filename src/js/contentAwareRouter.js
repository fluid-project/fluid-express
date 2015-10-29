// A router which passes a request to different handlers based on the content type.  A handler is itself an
// `RequestAwareRouter`, and will construct whatever components are needed to handle the underlying request.
//
// To use this grade, you must:
//
// 1. Add each `RequestAwareRouter` grade you need to your components.
// 2. Create a map indicating which content types should be handled by which `handler` grades, as in:
//
// handlers: {
//   json: {
//     contentType:   "application/json",
//     handlerGrades: ["name.spaced.grade1"]
//   },
//   text: {
//     contentType: ["text/html", "text/plain"]
//     handlerGrades: ["name.spaced.grade2", "name.spaced.grade1"]
//   }
// }
//
// The `Accepts` headers supplied by the user will be tested using `request.accepts(contentType)`.  The first
// `contentType` that matches will be used.  If no `Accepts` headers are provided, any contentType will match, and
// hence the first handler will be used.   Thus, you should add handlers in the order you would prefer that they are
// used.
//
// When the decision has been made and a match has been found, a dynamic component will be constructed using the
// appropriate 'handlerGrades'
//
// There is some similarity between this and `gpii.express.requestAware.router`, but this grade uses a slightly
// different mechanism.  When a request is received:
//
//    1.  The `accepts` headers are examined and compared to the list of available handlers in `options.handlers`.
//    2.  The first available handler is used for the rest of the process.
//    3.  An instance of `gpii.express.handler` is created with the additional grades defined in the handler options.
//
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./requestAwareRouter");

fluid.registerNamespace("gpii.express.contentAware.router");
gpii.express.contentAware.router.delegateToHandler = function (that, request, response) {
    var handlerGrades = gpii.express.contentAware.router.getHandlerGradesByContentType(that, request);
    if (handlerGrades) {
        that.events.onRequest.fire(request, response, handlerGrades);
    }
    else {
        response.status(500).send({ok: false, message: "Could not find an appropriate handler for the content types you accept."});
    }
};

gpii.express.contentAware.router.getHandlerGradesByContentType = function (that, request) {
    var handlerGrades = null;
    fluid.each(that.options.handlers, function (value) {
        if (!handlerGrades && Boolean(request.accepts(value.contentType))) {
            handlerGrades = value.handlerGrades;
        }
    });

    return handlerGrades;
};

fluid.defaults("gpii.express.contentAware.router", {
    gradeNames: ["gpii.express.router"],
    timeout: 5000,
    distributeOptions: {
        source: "{that}.options.timeout",
        target: "{that gpii.express.handler}.options.timeout"
    },
    events: {
        onRequest: null
    },
    // This was supposed to have been possible after https://issues.fluidproject.org/browse/FLUID-5742
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
        route: {
            funcName: "gpii.express.contentAware.router.delegateToHandler",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});
