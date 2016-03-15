/* Test environment for the "router" grade and "wrapper" modules for common Express routers. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes.js");
require("./fixtures");
require("./router-params-caseholder");

fluid.registerNamespace("gpii.express.tests.router.params.deepParamHandler");
gpii.express.tests.router.params.deepParamHandler.handleRequest = function (that) {
    that.sendResponse(200, { ok: true, params: that.request.params});
};

fluid.defaults("gpii.express.tests.router.params.deepParamHandler", {
    gradeName: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "gpii.express.tests.router.params.deepParamHandler.handleRequest",
            args: ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.tests.router.params.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:   7512,
    components: {
        express: {
            options: {
                components: {
                    params: {
                        type: "gpii.express.tests.router.params",
                        options: {
                            path: "/params/:myVar",
                            components: {
                                deepRouter: {
                                    type: "gpii.express.requestAware.router",
                                    options: {
                                        path: "/deep",
                                        routerOptions: {
                                            mergeParams: true
                                        },
                                        handlerGrades: ["gpii.express.tests.router.params.deepParamHandler"]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.router.params.caseHolder"
        }
    }
});

gpii.express.tests.router.params.testEnvironment();
