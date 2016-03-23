/* Tests for the "express" and "router" module */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes");
require("./contentAware-caseholder");

fluid.registerNamespace("gpii.express.tests.contentAware.handler");
gpii.express.tests.contentAware.handler.handleRequest = function (that) {
    that.sendResponse(that.options.statusCode, that.options.body);
};

fluid.defaults("gpii.express.tests.contentAware.handler", {
    gradeNames: ["gpii.express.handler"],
    statusCode: 200,
    invokers: {
        handleRequest: {
            funcName: "gpii.express.tests.contentAware.handler.handleRequest",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.tests.contentAware.defaultHandler", {
    gradeNames: ["gpii.express.tests.contentAware.handler"],
    body:       "This is the default response."
});

fluid.defaults("gpii.express.tests.contentAware.badDefaultHandler", {
    gradeNames: ["gpii.express.tests.contentAware.handler"],
    body:       "You should never see this."
});


fluid.defaults("gpii.express.tests.contentAware.jsonHandler", {
    gradeNames: ["gpii.express.tests.contentAware.handler"],
    body:       "This is a JSON response."
});

fluid.defaults("gpii.express.tests.contentAware.textHandler", {
    gradeNames: ["gpii.express.tests.contentAware.handler"],
    body:       "This is the text response."
});

fluid.defaults("gpii.express.tests.contentAware.router", {
    gradeNames: ["gpii.express.contentAware.router"],
    handlers: {
        // Confirm that we support "priorities".  This should not be allowed to handle requests with no `accept` header.
        badDefault: {
            contentType:   "default",
            handlerGrades: ["gpii.express.tests.contentAware.badDefaultHandler"]
        },
        // Confirm that we support "priorities".  This should be allowed to handle request with no `accept` headers.
        goodDefault: {
            priority:      "first",
            contentType:   "default",
            handlerGrades: ["gpii.express.tests.contentAware.defaultHandler"]
        },
        text: {
            contentType:   "text/html",
            handlerGrades: ["gpii.express.tests.contentAware.textHandler"]
        },
        json: {
            contentType:  "application/json",
            handlerGrades: ["gpii.express.tests.contentAware.jsonHandler"]
        }
    }
});

fluid.defaults("gpii.express.tests.contentAware.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:   6533,
    components: {
        express: {
            options: {
                components: {
                    router: {
                        type: "gpii.express.tests.contentAware.router",
                        options: {
                            path: "/"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.contentAware.caseHolder"
        }
    }
});

gpii.express.tests.contentAware.testEnvironment();
