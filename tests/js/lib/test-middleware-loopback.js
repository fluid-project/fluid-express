// "loopback" middleware that fires an `onRequestReceived` event with selected data it receives from the client.
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.test.express.loopbackMiddleware");

fluid.test.express.loopbackMiddleware.middleware = function (that, request, response) {
    var eventPayload = fluid.model.transformWithRules(request, that.options.rules.requestToEventPayload);
    that.events.onRequestReceived.fire(eventPayload);
    response.status(200).send({ message: "I passed on your message."});
};

fluid.defaults("fluid.test.express.loopbackMiddleware", {
    gradeNames: ["fluid.express.middleware"],
    path: "/loopback",
    events: {
        onRequestReceived: null
    },
    rules: {
        requestToEventPayload: {
            "":  "query"
        }
    },
    invokers: {
        middleware: {
            funcName: "fluid.test.express.loopbackMiddleware.middleware",
            args: ["{that}", "{arguments}.0", "{arguments}.1"] // request, response, next
        }
    }
});
