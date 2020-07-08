/* Tests for the "express" and "router" module */
"use strict";
var fluid = require("infusion");

require("../includes");
require("./contentAware-caseholder");

fluid.registerNamespace("fluid.tests.express.contentAware.handler");
fluid.tests.express.contentAware.handler.handleRequest = function (that) {
    that.sendResponse(that.options.statusCode, that.options.body);
};

fluid.defaults("fluid.tests.express.contentAware.handler", {
    gradeNames: ["fluid.express.handler"],
    statusCode: 200,
    invokers: {
        handleRequest: {
            funcName: "fluid.tests.express.contentAware.handler.handleRequest",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("fluid.tests.express.contentAware.defaultHandler", {
    gradeNames: ["fluid.tests.express.contentAware.handler"],
    body:       "This is the default response."
});

fluid.defaults("fluid.tests.express.contentAware.badDefaultHandler", {
    gradeNames: ["fluid.tests.express.contentAware.handler"],
    body:       "You should never see this."
});


fluid.defaults("fluid.tests.express.contentAware.jsonHandler", {
    gradeNames: ["fluid.tests.express.contentAware.handler"],
    body:       "This is a JSON response."
});

fluid.defaults("fluid.tests.express.contentAware.textHandler", {
    gradeNames: ["fluid.tests.express.contentAware.handler"],
    body:       "This is the text response."
});

fluid.defaults("fluid.tests.express.contentAware.middleware", {
    gradeNames: ["fluid.express.middleware.contentAware"],
    handlers: {
        // Confirm that we support "priorities".  This should not be allowed to handle requests with no `accept` header.
        badDefault: {
            // TODO:  Why don't "last", "first" or number values work for priority?
            contentType:   "*/*",
            priority:      "after:goodDefault",
            handlerGrades: ["fluid.tests.express.contentAware.badDefaultHandler"]
        },
        // Confirm that we support "priorities".  This should be allowed to handle request with no `accept` headers.
        goodDefault: {
            contentType:   "*/*",
            handlerGrades: ["fluid.tests.express.contentAware.defaultHandler"]
        },
        text: {
            contentType:   "text/html", // An example with one request type
            handlerGrades: ["fluid.tests.express.contentAware.textHandler"]
        },
        json: {
            contentType:   ["application/json", "application/secondary"],  // An example with multiple request types
            handlerGrades: ["fluid.tests.express.contentAware.jsonHandler"]
        }
    }
});

fluid.defaults("fluid.tests.express.contentAware.failureWare", {
    gradeNames: ["fluid.express.middleware.contentAware"],
    handlers: {
    }
});

fluid.defaults("fluid.tests.express.contentAware.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   6533,
    components: {
        express: {
            options: {
                components: {
                    failureware: {
                        type: "fluid.tests.express.contentAware.failureWare",
                        options: {
                            priority: "first",
                            path:     "/hcf"
                        }
                    },
                    successWare: {
                        type: "fluid.tests.express.contentAware.middleware",
                        options: {
                            path: "/"
                        }
                    },
                    rootErrorCatcher: {
                        type: "fluid.express.middleware.error",
                        options: {
                            priority: "after:successWare"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.contentAware.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.contentAware.testEnvironment");
