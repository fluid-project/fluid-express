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
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./requestAwareRouter");

fluid.registerNamespace("gpii.express.contentAware.router");
gpii.express.contentAware.router.delegateToHandler = function (that, request, response) {
    var handlerGrades = gpii.express.contentAware.router.getHandlerGradesByContentType(that, request, that.options.handlers);
    if (handlerGrades) {
        // Add a third argument with the list of grades.
        that.events.onRequest.fire(request, response, handlerGrades);
    }
    else {
        response.status(500).send({ok: false, message: "Could not find an appropriate handler for the content types you accept."});
    }
};

gpii.express.contentAware.router.getHandlerGradesByContentType = function (that, request, handlers) {
    var handlerGrades = null;
    fluid.each(handlers, function (value) {
        if (!handlerGrades && Boolean(request.accepts(value.contentType))) {
            handlerGrades = value.handlerGrades;
        }
    });

    return handlerGrades;
};

gpii.express.contentAware.router.getHandler = function (that) {
    return that.delegateToHandler;
};

fluid.defaults("gpii.express.contentAware.router", {
    gradeNames: ["gpii.express.router"],
    events: {
        onRequest: null
    },
    dynamicComponents: {
        // This intermediate structure is required because we cannot directly refer to the original list of grades
        // from a `gradeNames` option.  This will be resolved once we upgrade beyond the versions of infusion affected by:
        // https://issues.fluidproject.org/browse/FLUID-5742
        broker: {
            type:          "fluid.component",
            createOnEvent: "onRequest",
            options: {
                gradeNames:    ["gpii.express.contentAware.broker"],
                mergePolicy: {
                    "request":  "nomerge",
                    "response": "nomerge"
                },
                request:       "{arguments}.0",
                response:      "{arguments}.1",
                handlerGrades: "{arguments}.2",
                components: {
                    requestHandler: {
                        type:          "gpii.express.handler",
                        options: {
                            timeout:    "{router}.options.timeout",
                            request:    "{broker}.options.request",
                            response:   "{broker}.options.response",
                            gradeNames: "{broker}.options.handlerGrades",
                            listeners: {
                                "onDestroy.killMyParent": {
                                    func: "{broker}.destroy"
                                }
                            }
                        }
                    }
                }
            }
        }

    },
    invokers: {
        getHandler: {
            funcName: "gpii.express.contentAware.router.getHandler",
            args:     ["{that}"]
        },
        delegateToHandler: {
            funcName: "gpii.express.contentAware.router.delegateToHandler",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});
