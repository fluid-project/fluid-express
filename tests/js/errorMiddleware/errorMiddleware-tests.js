/*

    Tests for the "error handling" middleware.

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes.js");

// We borrow a router from the router tests to help in testing middleware isolation
require("../router/fixtures");
require("./errorMiddleware-caseholder");

fluid.registerNamespace("gpii.tests.express.errorMiddleware.errorPitcher");
gpii.tests.express.errorMiddleware.errorPitcher.haltAndCatchFire = function (that, request, response, next) {
    next({ isError: true, message: "Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?"});
};

fluid.defaults("gpii.tests.express.errorMiddleware.errorPitcher", {
    gradeNames: ["gpii.express.router"],
    invokers: {
        route: {
            funcName: "gpii.tests.express.errorMiddleware.errorPitcher.haltAndCatchFire",
            args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
        }
    }
});

fluid.defaults("gpii.tests.express.errorMiddleware.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
    port:   7551,
    components: {
        express: {
            options: {
                components: {
                    simpleErrorPitcher: {
                        type: "gpii.tests.express.errorMiddleware.errorPitcher",
                        options: {
                            namespace: "simpleErrorPitcher",
                            priority: "first",
                            path: "/simple",
                            components: {
                            }
                        }
                    },
                    simpleErrorCatcher: {
                        type: "gpii.express.middleware.error",
                        options: {
                            namespace: "simpleErrorCatcher",
                            priority: "after:simpleErrorPitcher"
                        }
                    },
                    complexErrorPitcher: {
                        type: "gpii.tests.express.errorMiddleware.errorPitcher",
                        options: {
                            path: "/complex",
                            namespace: "complexErrorPitcher",
                            priority: "after:simpleErrorCatcher"
                        }
                    },
                    complexErrorCatcher: {
                        type: "gpii.express.middleware.error",
                        options: {
                            componentOptions: "are good",
                            errorOutputRules: {
                                componentOptions: "that.options.componentOptions",
                                literalValues:    { literalValue: "are also fine" },
                                errorWrapper:     "error",
                                requestMethod:    "request.method"
                            }
                        }
                    },
                    nested: {
                        type: "gpii.express.router.passthrough",
                        options: {
                            namespace: "nested",
                            path:      "/nested",
                            priority:  "after:complexErrorCatcher",
                            components: {
                                deepErrorPitcher: {
                                    type: "gpii.tests.express.errorMiddleware.errorPitcher",
                                    options: {
                                        path: "/",
                                        priority: "first"
                                    }
                                },
                                deepErrorCatcher: {
                                    type: "gpii.express.middleware.error",
                                    options: {
                                        priority: "last",
                                        errorOutputRules: {
                                            "": { literalValue: "The deep error handler responded." }
                                        }
                                    }
                                }
                            }

                        }
                    },
                    stringErrorPitcher: {
                        type: "gpii.tests.express.errorMiddleware.errorPitcher",
                        options: {
                            path: "/string",
                            namespace: "stringErrorPitcher",
                            priority: "after:nested"
                        }
                    },
                    rootErrorPitcher: {
                        type: "gpii.tests.express.errorMiddleware.errorPitcher",
                        options: {
                            path: "/",
                            namespace: "rootErrorPitcher",
                            priority: "after:stringErrorPitcher"
                        }
                    },
                    errorHeaderSetter: {
                        type: "gpii.express.middleware.headerSetter.error",
                        options: {
                            namespace: "errorHeaderSetter",
                            priority:  "after:rootErrorPitcher",
                            headers: {
                                queryVar: {
                                    fieldName: "My-Request-Went-To-Hell",
                                    template:  "and all I got was this lousy header...",
                                    dataRules: {}
                                }
                            }
                        }
                    },
                    rootErrorCatcher: {
                        type: "gpii.express.middleware.error",
                        options: {
                            priority: "after:errorHeaderSetter",
                            errorOutputRules: {
                                "": { literalValue: "The root error handler responded." }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.errorMiddleware.caseHolder"
        }
    }
});

gpii.tests.express.errorMiddleware.testEnvironment();
