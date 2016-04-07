/* Tests for the "express" and "router" module */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes");
require("./contentAware-caseholder");

fluid.registerNamespace("gpii.tests.express.contentAware.handler");
gpii.tests.express.contentAware.handler.handleRequest = function (that) {
    that.sendResponse(that.options.statusCode, that.options.body);
};

fluid.defaults("gpii.tests.express.contentAware.handler", {
    gradeNames: ["gpii.express.handler"],
    statusCode: 200,
    invokers: {
        handleRequest: {
            funcName: "gpii.tests.express.contentAware.handler.handleRequest",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.tests.express.contentAware.defaultHandler", {
    gradeNames: ["gpii.tests.express.contentAware.handler"],
    body:       "This is the default response."
});

fluid.defaults("gpii.tests.express.contentAware.badDefaultHandler", {
    gradeNames: ["gpii.tests.express.contentAware.handler"],
    body:       "You should never see this."
});


fluid.defaults("gpii.tests.express.contentAware.jsonHandler", {
    gradeNames: ["gpii.tests.express.contentAware.handler"],
    body:       "This is a JSON response."
});

fluid.defaults("gpii.tests.express.contentAware.textHandler", {
    gradeNames: ["gpii.tests.express.contentAware.handler"],
    body:       "This is the text response."
});

fluid.defaults("gpii.tests.express.contentAware.router", {
    gradeNames: ["gpii.express.contentAware.router"],
    handlers: {
        // Confirm that we support "priorities".  This should not be allowed to handle requests with no `accept` header.
        badDefault: {
            contentType:   "default",
            handlerGrades: ["gpii.tests.express.contentAware.badDefaultHandler"]
        },
        // Confirm that we support "priorities".  This should be allowed to handle request with no `accept` headers.
        goodDefault: {
            priority:      "first",
            contentType:   "default",
            handlerGrades: ["gpii.tests.express.contentAware.defaultHandler"]
        },
        text: {
            contentType:   "text/html",
            handlerGrades: ["gpii.tests.express.contentAware.textHandler"]
        },
        json: {
            contentType:  "application/json",
            handlerGrades: ["gpii.tests.express.contentAware.jsonHandler"]
        }
    }
});

fluid.defaults("gpii.tests.express.contentAware.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
    port:   6533,
    components: {
        express: {
            options: {
                components: {
                    router: {
                        type: "gpii.tests.express.contentAware.router",
                        options: {
                            path: "/"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.contentAware.caseHolder"
        }
    }
});

gpii.tests.express.contentAware.testEnvironment();
