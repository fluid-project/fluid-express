/*

    Tests for the "error handling" middleware.

*/
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes.js");

require("./errorMiddleware-caseholder");

fluid.registerNamespace("fluid.tests.express.errorMiddleware.errorPitcher");
fluid.tests.express.errorMiddleware.errorPitcher.haltAndCatchFire = function (that, request, response, next) {
    next({ isError: true, message: "Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?"});
};

fluid.defaults("fluid.tests.express.errorMiddleware.errorPitcher", {
    gradeNames: ["fluid.express.middleware"],
    invokers: {
        middleware: {
            funcName: "fluid.tests.express.errorMiddleware.errorPitcher.haltAndCatchFire",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
        }
    }
});

// Send a response, and then throw an error.
fluid.registerNamespace("fluid.tests.express.errorMiddleware.optimisticResponder");
fluid.tests.express.errorMiddleware.optimisticResponder.respondThenThrowError = function (that, request, response, next) {
    response.send({ message: "Seems like everything is fine."});
    next({ isError: true, message: "Oops. Everything is NOT fine."});
};

fluid.defaults("fluid.tests.express.errorMiddleware.optimisticResponder", {
    gradeNames: ["fluid.express.middleware"],
    invokers: {
        middleware: {
            funcName: "fluid.tests.express.errorMiddleware.optimisticResponder.respondThenThrowError",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
        }
    }
});

fluid.defaults("fluid.tests.express.errorMiddleware.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7551,
    components: {
        express: {
            options: {
                components: {
                    simpleErrorPitcher: {
                        type: "fluid.tests.express.errorMiddleware.errorPitcher",
                        options: {
                            path: "/simple"
                        }
                    },
                    simpleErrorCatcher: {
                        type: "fluid.express.middleware.error",
                        options: {
                            priority: "after:simpleErrorPitcher"
                        }
                    },
                    complexErrorPitcher: {
                        type: "fluid.tests.express.errorMiddleware.errorPitcher",
                        options: {
                            path: "/complex",
                            priority: "after:simpleErrorCatcher"
                        }
                    },
                    complexErrorCatcher: {
                        type: "fluid.express.middleware.error",
                        options: {
                            priority: "after:complexErrorPitcher",
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
                        type: "fluid.express.router",
                        options: {
                            namespace: "nested",
                            path:      "/nested",
                            priority:  "after:complexErrorCatcher",
                            components: {
                                deepErrorPitcher: {
                                    type: "fluid.tests.express.errorMiddleware.errorPitcher",
                                    options: {
                                        path: "/"
                                    }
                                },
                                deepErrorCatcher: {
                                    type: "fluid.express.middleware.error",
                                    options: {
                                        priority: "after:deepErrorPitcher",
                                        errorOutputRules: {
                                            "": { literalValue: "The deep error handler responded." }
                                        }
                                    }
                                }
                            }

                        }
                    },
                    stringErrorPitcher: {
                        type: "fluid.tests.express.errorMiddleware.errorPitcher",
                        options: {
                            path: "/string",
                            priority: "after:nested"
                        }
                    },
                    respondAndError: {
                        type: "fluid.tests.express.errorMiddleware.optimisticResponder",
                        options: {
                            path: "/overlyOptimistic",
                            priority: "before:rootErrorPitcher"
                        }
                    },
                    rootErrorPitcher: {
                        type: "fluid.tests.express.errorMiddleware.errorPitcher",
                        options: {
                            path: "/",
                            priority: "after:stringErrorPitcher"
                        }
                    },
                    errorHeaderSetter: {
                        type: "fluid.express.middleware.headerSetter.error",
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
                        type: "fluid.express.middleware.error",
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
            type: "fluid.tests.express.errorMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.errorMiddleware.testEnvironment");
