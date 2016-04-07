/*
    The test environment to test the "passthrough" router module.
*/

"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes.js");
require("./passthroughRouter-caseholder");

fluid.registerNamespace("gpii.tests.express.passthroughRouter.handler");
gpii.tests.express.passthroughRouter.handler.handleRequest = function (that) {
    that.sendResponse(that.options.statusCode, that.options.body);
};

fluid.defaults("gpii.tests.express.passthroughRouter.handler", {
    gradeNames: ["gpii.express.handler"],
    statusCode: 200,
    invokers: {
        handleRequest: {
            funcName: "gpii.tests.express.passthroughRouter.handler.handleRequest",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.tests.express.passthroughRouter.top.handler", {
    gradeNames: ["gpii.tests.express.passthroughRouter.handler"],
    body:       "You are at the top."
});

fluid.defaults("gpii.tests.express.passthroughRouter.middle.handler", {
    gradeNames: ["gpii.tests.express.passthroughRouter.handler"],
    body:       "You are in the middle."
});

fluid.defaults("gpii.tests.express.passthroughRouter.bottom.handler", {
    gradeNames: ["gpii.tests.express.passthroughRouter.handler"],
    body:       "You are on the bottom."
});

fluid.defaults("gpii.tests.express.passthroughRouter.router", {
    gradeNames: ["gpii.express.router.passthrough"],
    components: {
        top: {
            type: "gpii.express.router.passthrough",
            options: {
                path: "/top",
                components: {
                    topResponder: {
                        type: "gpii.express.requestAware.router",
                        options: {
                            namespace:     "top",
                            path:          "/",
                            handlerGrades: ["gpii.tests.express.passthroughRouter.top.handler"]
                        }
                    },
                    middle: {
                        type: "gpii.express.router.passthrough",
                        options: {
                            priority: "before:top",
                            path: "/middle",
                            components: {
                                middleResponder: {
                                    type: "gpii.express.requestAware.router",
                                    options: {
                                        namespace:     "middleResponder",
                                        path:          "/",
                                        handlerGrades: ["gpii.tests.express.passthroughRouter.middle.handler"]
                                    }
                                },
                                bottom: {
                                    type: "gpii.express.router.passthrough",
                                    options: {
                                        path: "/bottom",
                                        priority: "before:middleResponder",
                                        components: {
                                            bottomResponder: {
                                                type: "gpii.express.requestAware.router",
                                                options: {
                                                    path:          "/",
                                                    handlerGrades: ["gpii.tests.express.passthroughRouter.bottom.handler"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.express.passthroughRouter.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
    port:   7593,
    components: {
        express: {
            options: {
                components: {
                    router: {
                        type: "gpii.tests.express.passthroughRouter.router",
                        options: {
                            path: "/"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.passthroughRouter.caseHolder"
        }
    }
});

gpii.tests.express.passthroughRouter.testEnvironment();
