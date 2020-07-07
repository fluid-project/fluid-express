/*

    Tests to confirm that methods (GET, POST, PUT, and DELETE) that use the same path are cleanly separated.

 */
"use strict";
var fluid = require("infusion");

require("../includes");

require("./method-caseholder");

fluid.defaults("fluid.tests.express.method.router", {
    gradeNames: ["fluid.express.router"],
    path: "/",
    components: {
        counter: {
            type: "fluid.test.express.middleware.counter",
            options: {
                //priority: "before:requestAware"
                priority: "first" // TODO: Why does this work and the other doesn't?
            }
        },
        requestAware: {
            type: "fluid.express.middleware.requestAware",
            options: {
                method:        "{fluid.tests.express.method.router}.options.method",
                handlerGrades: "{fluid.tests.express.method.router}.options.handlerGrades"
            }
        }
    }
});

fluid.defaults("fluid.tests.express.method.handler", {
    gradeNames: ["fluid.express.handler"],
    invokers: {
        handleRequest: {
            func: "{that}.sendResponse",
            args: [ 200, "{that}.options.message"]
        }
    }
});

fluid.defaults("fluid.tests.express.method.getHandler", {
    gradeNames: ["fluid.tests.express.method.handler"],
    message:    "This is a response from the GET endpoint."
});

fluid.defaults("fluid.tests.express.method.postHandler", {
    gradeNames: ["fluid.tests.express.method.handler"],
    message:    "This is a response from the POST endpoint."
});

fluid.defaults("fluid.tests.express.method.putHandler", {
    gradeNames: ["fluid.tests.express.method.handler"],
    message:    "This is a response from the PUT endpoint."
});

fluid.defaults("fluid.tests.express.method.deleteHandler", {
    gradeNames: ["fluid.tests.express.method.handler"],
    message:    "This is a response from the DELETE endpoint."
});

fluid.defaults("fluid.tests.express.method.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7521,
    components: {
        express: {
            options: {
                port: "{testEnvironment}.options.port",
                baseUrl: "{testEnvironment}.options.baseUrl",
                components: {
                    get: {
                        type: "fluid.tests.express.method.router",
                        options: {
                            method:        "get",
                            handlerGrades: ["fluid.tests.express.method.getHandler"]
                        }
                    },
                    post: {
                        type: "fluid.tests.express.method.router",
                        options: {
                            method:        "post",
                            handlerGrades: ["fluid.tests.express.method.postHandler"]
                        }
                    },
                    put: {
                        type: "fluid.tests.express.method.router",
                        options: {
                            method:        "put",
                            handlerGrades: ["fluid.tests.express.method.putHandler"]
                        }
                    },
                    "delete": {
                        type: "fluid.tests.express.method.router",
                        options: {
                            method:        "delete",
                            handlerGrades: ["fluid.tests.express.method.deleteHandler"]
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.method.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.method.testEnvironment");
