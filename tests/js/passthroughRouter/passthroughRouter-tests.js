/*
    The test environment to test the "passthrough" router module.
*/

"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes.js");
require("./passthroughRouter-caseholder");

fluid.registerNamespace("gpii.express.tests.passthroughRouter.handler");
gpii.express.tests.passthroughRouter.handler.handleRequest = function (that) {
    that.sendResponse(that.options.statusCode, that.options.body);
};

fluid.defaults("gpii.express.tests.passthroughRouter.handler", {
    gradeNames: ["gpii.express.handler"],
    statusCode: 200,
    invokers: {
        handleRequest: {
            funcName: "gpii.express.tests.passthroughRouter.handler.handleRequest",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("gpii.express.tests.passthroughRouter.top.handler", {
    gradeNames: ["gpii.express.tests.passthroughRouter.handler"],
    body:       "You are at the top."
});

fluid.defaults("gpii.express.tests.passthroughRouter.middle.handler", {
    gradeNames: ["gpii.express.tests.passthroughRouter.handler"],
    body:       "You are in the middle."
});

fluid.defaults("gpii.express.tests.passthroughRouter.bottom.handler", {
    gradeNames: ["gpii.express.tests.passthroughRouter.handler"],
    body:       "You are on the bottom."
});

fluid.defaults("gpii.express.tests.passthroughRouter.router", {
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
                            path:          "/",
                            handlerGrades: ["gpii.express.tests.passthroughRouter.top.handler"]
                        }
                    },
                    middle: {
                        type: "gpii.express.router.passthrough",
                        options: {
                            path: "/middle",
                            components: {
                                middleResponder: {
                                    type: "gpii.express.requestAware.router",
                                    options: {
                                        path:          "/",
                                        handlerGrades: ["gpii.express.tests.passthroughRouter.middle.handler"]
                                    }
                                },
                                bottom: {
                                    type: "gpii.express.router.passthrough",
                                    options: {
                                        path: "/bottom",
                                        components: {
                                            bottomResponder: {
                                                type: "gpii.express.requestAware.router",
                                                options: {
                                                    path:          "/",
                                                    handlerGrades: ["gpii.express.tests.passthroughRouter.bottom.handler"]
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

fluid.defaults("gpii.express.tests.passthroughRouter.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:   7593,
    components: {
        express: {
            options: {
                components: {
                    router: {
                        type: "gpii.express.tests.passthroughRouter.router",
                        options: {
                            path: "/"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.passthroughRouter.caseHolder"
        }
    }
});

gpii.express.tests.passthroughRouter.testEnvironment();
