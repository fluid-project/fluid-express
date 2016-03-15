/*

    Tests to confirm that methods (GET, POST, PUT, and DELETE) that use the same path are cleanly separated.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../includes");
require("../middleware/fixtures/");

require("./method-caseholder");

fluid.defaults("gpii.express.tests.method.router", {
    gradeNames: ["gpii.express.requestAware.router"],
    path: "/",
    components: {
        counter: {
            type: "gpii.express.tests.middleware.counter",
            options: {
                method: "{gpii.express.tests.method.router}.options.method"
            }
        }
    }
});

fluid.defaults("gpii.express.tests.method.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            func: "{that}.sendResponse",
            args: [ 200, "{that}.options.message"]
        }
    }
});

fluid.defaults("gpii.express.tests.method.getHandler", {
    gradeNames: ["gpii.express.tests.method.handler"],
    message:    "This is a response from the GET endpoint."
});

fluid.defaults("gpii.express.tests.method.postHandler", {
    gradeNames: ["gpii.express.tests.method.handler"],
    message:    "This is a response from the POST endpoint."
});

fluid.defaults("gpii.express.tests.method.putHandler", {
    gradeNames: ["gpii.express.tests.method.handler"],
    message:    "This is a response from the PUT endpoint."
});

fluid.defaults("gpii.express.tests.method.deleteHandler", {
    gradeNames: ["gpii.express.tests.method.handler"],
    message:    "This is a response from the DELETE endpoint."
});

fluid.defaults("gpii.express.tests.method.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:   7521,
    components: {
        express: {
            options: {
                config: {
                    express: {
                        port: "{testEnvironment}.options.port",
                        baseUrl: "{testEnvironment}.options.baseUrl",
                        session: {
                            secret: "Printer, printer take a hint-ter."
                        }
                    }
                },
                components: {
                    get: {
                        type: "gpii.express.tests.method.router",
                        options: {
                            method:        "get",
                            handlerGrades: ["gpii.express.tests.method.getHandler"]
                        }
                    },
                    post: {
                        type: "gpii.express.tests.method.router",
                        options: {
                            method:        "post",
                            handlerGrades: ["gpii.express.tests.method.postHandler"]
                        }
                    },
                    put: {
                        type: "gpii.express.tests.method.router",
                        options: {
                            method:        "put",
                            handlerGrades: ["gpii.express.tests.method.putHandler"]
                        }
                    },
                    "delete": {
                        type: "gpii.express.tests.method.router",
                        options: {
                            method:        "delete",
                            handlerGrades: ["gpii.express.tests.method.deleteHandler"]
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.method.caseHolder"
        }
    }
});

gpii.express.tests.method.testEnvironment();
