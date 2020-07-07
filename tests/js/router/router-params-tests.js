/* Test environment for the "router" grade and "wrapper" modules for common Express routers. */
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes.js");
require("./router-params-caseholder");

fluid.registerNamespace("fluid.tests.express.router.params.deepParamHandler");
fluid.tests.express.router.params.deepParamHandler.handleRequest = function (that) {
    that.sendResponse(200, { ok: true, params: that.options.request.params});
};

fluid.defaults("fluid.tests.express.router.params.deepParamHandler", {
    gradeName: ["fluid.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "fluid.tests.express.router.params.deepParamHandler.handleRequest",
            args: ["{that}"]
        }
    }
});

fluid.defaults("fluid.tests.express.router.params.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7512,
    components: {
        express: {
            options: {
                components: {
                    params: {
                        type: "fluid.express.router",
                        options: {
                            path: "/params/:myVar",
                            routerOptions: {
                                mergeParams: true
                            },
                            components: {
                                deepMiddleware: {
                                    type: "fluid.express.middleware.requestAware",
                                    options: {
                                        priority: "last",
                                        handlerGrades: ["fluid.tests.express.router.params.deepParamHandler"]
                                    }
                                },
                                deepPathedMiddleware: {
                                    type: "fluid.express.middleware.requestAware",
                                    options: {
                                        path: "/deep",
                                        handlerGrades: ["fluid.tests.express.router.params.deepParamHandler"]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.router.params.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.router.params.testEnvironment");
