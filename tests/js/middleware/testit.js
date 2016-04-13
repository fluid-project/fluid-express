// Sanity checking new router and middleware wiring
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.setLogging(true);

require("../../../index");

fluid.registerNamespace("gpii.tests.express.respondingMiddleware");
gpii.tests.express.respondingMiddleware.respond = function (that, request, response) {
    response.send(that.options.message);
};

fluid.defaults("gpii.tests.express.respondingMiddleware", {
    gradeNames: ["gpii.express.middleware"],
    message: "Here we are now.",
    invokers: {
        middleware: {
            funcName: "gpii.tests.express.respondingMiddleware.respond",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});

gpii.express({
    port: "8990",
    components: {
        pathed: {
            type: "gpii.express.router",
            options: {
                path: "/pathed",
                components: {
                    responder: {
                        type: "gpii.tests.express.respondingMiddleware",
                        options: {
                            message: "Pathed."
                        }
                    }
                }
            }
        },
        rootNoRouter: {
            type: "gpii.tests.express.respondingMiddleware",
            options: {
                message: "Root."
            }
        }
    }
});