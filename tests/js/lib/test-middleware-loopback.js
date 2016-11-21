/* eslint-env node */
// "loopback" middleware that fires an `onRequestReceived` event with selected data it receives from the client.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.test.express.loopbackMiddleware");

gpii.test.express.loopbackMiddleware.middleware = function (that, request, response) {
    var eventPayload = fluid.model.transformWithRules(request, that.options.rules.requestToEventPayload);
    that.events.onRequestReceived.fire(eventPayload);
    response.status(200).send({ message: "I passed on your message."});
};

fluid.defaults("gpii.test.express.loopbackMiddleware", {
    gradeNames: ["gpii.express.middleware"],
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
            funcName: "gpii.test.express.loopbackMiddleware.middleware",
            args: ["{that}", "{arguments}.0", "{arguments}.1"] // request, response, next
        }
    }
});
