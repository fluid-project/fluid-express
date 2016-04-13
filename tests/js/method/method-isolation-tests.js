/*

    Tests to confirm that methods (GET, POST, PUT, and DELETE) that use the same path are cleanly separated.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes");

require("./method-caseholder");

fluid.defaults("gpii.tests.express.method.router", {
    gradeNames: ["gpii.express.router"],
    path: "/",
    components: {
        counter: {
            type: "gpii.tests.express.middleware.counter",
            options: {
                priority: "first"
            }
        },
        requestAware: {
            type: "gpii.express.middleware.requestAware",
            options: {
                method:        "{gpii.tests.express.method.router}.options.method",
                handlerGrades: "{gpii.tests.express.method.router}.options.handlerGrades"
            }
        }
    }
});

fluid.defaults("gpii.tests.express.method.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            func: "{that}.sendResponse",
            args: [ 200, "{that}.options.message"]
        }
    }
});

fluid.defaults("gpii.tests.express.method.getHandler", {
    gradeNames: ["gpii.tests.express.method.handler"],
    message:    "This is a response from the GET endpoint."
});

fluid.defaults("gpii.tests.express.method.postHandler", {
    gradeNames: ["gpii.tests.express.method.handler"],
    message:    "This is a response from the POST endpoint."
});

fluid.defaults("gpii.tests.express.method.putHandler", {
    gradeNames: ["gpii.tests.express.method.handler"],
    message:    "This is a response from the PUT endpoint."
});

fluid.defaults("gpii.tests.express.method.deleteHandler", {
    gradeNames: ["gpii.tests.express.method.handler"],
    message:    "This is a response from the DELETE endpoint."
});

fluid.defaults("gpii.tests.express.method.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
    port:   7521,
    components: {
        express: {
            options: {
                port: "{testEnvironment}.options.port",
                baseUrl: "{testEnvironment}.options.baseUrl",
                components: {
                    get: {
                        type: "gpii.tests.express.method.router",
                        options: {
                            method:        "get",
                            handlerGrades: ["gpii.tests.express.method.getHandler"]
                        }
                    },
                    post: {
                        type: "gpii.tests.express.method.router",
                        options: {
                            method:        "post",
                            handlerGrades: ["gpii.tests.express.method.postHandler"]
                        }
                    },
                    put: {
                        type: "gpii.tests.express.method.router",
                        options: {
                            method:        "put",
                            handlerGrades: ["gpii.tests.express.method.putHandler"]
                        }
                    },
                    "delete": {
                        type: "gpii.tests.express.method.router",
                        options: {
                            method:        "delete",
                            handlerGrades: ["gpii.tests.express.method.deleteHandler"]
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.method.caseHolder"
        }
    }
});

gpii.tests.express.method.testEnvironment();
