/* eslint-env node */
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

fluid.defaults("gpii.tests.express.contentAware.middleware", {
    gradeNames: ["gpii.express.middleware.contentAware"],
    handlers: {
        // Confirm that we support "priorities".  This should not be allowed to handle requests with no `accept` header.
        badDefault: {
            // TODO:  Why don't "last", "first" or number values work for priority?
            contentType:   "*/*",
            priority:      "after:goodDefault",
            handlerGrades: ["gpii.tests.express.contentAware.badDefaultHandler"]
        },
        // Confirm that we support "priorities".  This should be allowed to handle request with no `accept` headers.
        goodDefault: {
            contentType:   "*/*",
            handlerGrades: ["gpii.tests.express.contentAware.defaultHandler"]
        },
        text: {
            contentType:   "text/html", // An example with one request type
            handlerGrades: ["gpii.tests.express.contentAware.textHandler"]
        },
        json: {
            contentType:   ["application/json", "application/secondary"],  // An example with multiple request types
            handlerGrades: ["gpii.tests.express.contentAware.jsonHandler"]
        }
    }
});

fluid.defaults("gpii.tests.express.contentAware.failureWare", {
    gradeNames: ["gpii.express.middleware.contentAware"],
    handlers: {
    }
});

fluid.defaults("gpii.tests.express.contentAware.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:   6533,
    components: {
        express: {
            options: {
                components: {
                    failureware: {
                        type: "gpii.tests.express.contentAware.failureWare",
                        options: {
                            priority: "first",
                            path:     "/hcf"
                        }
                    },
                    successWare: {
                        type: "gpii.tests.express.contentAware.middleware",
                        options: {
                            path: "/"
                        }
                    },
                    rootErrorCatcher: {
                        type: "gpii.express.middleware.error",
                        options: {
                            priority: "after:successWare"
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

fluid.test.runTests("gpii.tests.express.contentAware.testEnvironment");
