/*

    Practical tests to confirm that the `priority` of middleware and routers controls the order in which it is wired in.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../../");
gpii.express.loadTestingSupport();

fluid.registerNamespace("gpii.tests.express.priority");

// Function to either add a string to a "work in progress" header or send the final results on to the user, depending
// on whether we are the last in the chain (i.e. whether we have a `next` function).
//
gpii.tests.express.priority.sendString = function (request, response, string, next) {
    if (next) {
        var currentValue = response.get("Exquisite-Corpse");
        response.set("Exquisite-Corpse", (currentValue || "") + string);
        next();
    }
    else {
        var headerValue = response.get("Exquisite-Corpse");
        response.send((headerValue  || "") + string);
    }
};

// Middleware that adds a string to the "work in progress" header.
fluid.defaults("gpii.tests.express.priority.oneStringMiddleware", {
    gradeNames: ["gpii.express.middleware"],
    invokers: {
        middleware: {
            funcName: "gpii.tests.express.priority.sendString",
            args:     ["{arguments}.0", "{arguments}.1", "{that}.options.theString", "{arguments}.2"] // request, response, string, next
        }
    }
});

// Router that outputs the "work in progress" header (if found) plus its own string.
fluid.defaults("gpii.tests.express.priority.oneStringRouter", {
    gradeNames: ["gpii.express.router"],
    invokers: {
        route: {
            funcName: "gpii.tests.express.priority.sendString",
            args:     ["{arguments}.0", "{arguments}.1", "{that}.options.theString"] // request, response, string
        }
    }
});

fluid.defaults("gpii.tests.express.priority.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing precedence when multiple routers listen for the same path...",
                    type: "test",
                    sequence: [
                        {
                            func: "{whoWinsRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            event:    "{whoWinsRequest}.events.onComplete",
                            args:     ["The right router should have responded...", "{testCaseHolder}.options.expected.whoWins", "{arguments}.0" ]
                        }
                    ]
                },
                {
                    name: "Testing middleware and router precedence in combination...",
                    type: "test",
                    sequence: [
                        {
                            func: "{combinedRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            event:    "{combinedRequest}.events.onComplete",
                            args:     ["The response should have come together in the right order...", "{testCaseHolder}.options.expected.combined", "{arguments}.0" ]
                        }
                    ]
                }
            ]
        }
    ],
    expected: {
        whoWins:  "Hello, just in time.",
        combined: "Hello, ordered world."
    },
    components: {
        whoWinsRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "whoWins"
            }
        },
        combinedRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "combined"
            }
        }
    }
});

fluid.defaults("gpii.tests.express.priority.testEnvironment", {
    gradeNames: ["gpii.tests.express.testEnvironment"],
    port:   7593,
    components: {
        express: {
            options: {
                components: {
                    // Confirming that the correct router gets the first shot at responding by surrounding it with
                    // wrong numbers.
                    tooSoon: {
                        type:      "gpii.tests.express.priority.oneStringRouter",
                        options: {
                            priority:  "after:justInTime",
                            namespace: "tooSoon",
                            path:      "/whoWins",
                            theString: "Hello, too soon."
                        }
                    },
                    justInTime: {
                        type:      "gpii.tests.express.priority.oneStringRouter",
                        options: {
                            priority:  "before:tooLate",
                            namespace: "justInTime",
                            path:      "/whoWins",
                            theString: "Hello, just in time."
                        }

                    },
                    tooLate: {
                        type:      "gpii.tests.express.priority.oneStringRouter",
                        options: {
                            namespace: "tooLate",
                            path:      "/whoWins",
                            theString: "Hello, too late."
                        }
                    },
                    // A combination of middleware and routers that should spit out "Hello, ordered world." when hit in the right order.
                    combined: {
                        type:      "gpii.express.router.passthrough",
                        options: {
                            path:      "/combined",
                            components: {
                                lastWord: {
                                    type:      "gpii.tests.express.priority.oneStringRouter",
                                    options: {
                                        priority:  "after:ordered",
                                        namespace: "lastWord",
                                        path:      "/",
                                        theString: " world."
                                    }
                                },
                                ordered: {
                                    type:      "gpii.tests.express.priority.oneStringMiddleware",
                                    options: {
                                        priority:  "after:hello",
                                        namespace: "ordered",
                                        theString: " ordered"
                                    }
                                },
                                hello: {
                                    type:      "gpii.tests.express.priority.oneStringMiddleware",
                                    options: {
                                        namespace: "hello",
                                        theString: "Hello,"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.priority.caseHolder"
        }
    }
});

gpii.tests.express.priority.testEnvironment();