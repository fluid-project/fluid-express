/*

    Practical tests to confirm that the `priority` of middleware and routers controls the order in which it is wired in.

 */
"use strict";
var fluid = require("infusion");

require("../../../");
fluid.express.loadTestingSupport();

fluid.registerNamespace("fluid.tests.express.priority");

// Function to either add a string to a "work in progress" header or send the final results on to the user, depending
// on whether we are the last in the chain (i.e. whether we have a `next` function).
//
fluid.tests.express.priority.sendString = function (request, response, string, next) {
    if (next) {
        var currentValue = response.get("Exquisite-Corpse");
        response.set("Exquisite-Corpse", (currentValue || "") + string);
        next();
    }
    else {
        var headerValue = response.get("Exquisite-Corpse");
        response.send((headerValue || "") + string);
    }
};

// Middleware that adds a string to the "work in progress" header.
fluid.defaults("fluid.tests.express.priority.oneStringMiddleware", {
    gradeNames: ["fluid.express.middleware"],
    invokers: {
        middleware: {
            funcName: "fluid.tests.express.priority.sendString",
            args:     ["{arguments}.0", "{arguments}.1", "{that}.options.theString", "{arguments}.2"] // request, response, string, next
        }
    }
});

// Router that outputs the "work in progress" header (if found) plus its own string.
fluid.defaults("fluid.tests.express.priority.stringOutputter", {
    gradeNames: ["fluid.express.middleware"],
    invokers: {
        middleware: {
            funcName: "fluid.tests.express.priority.sendString",
            args:     ["{arguments}.0", "{arguments}.1", "{that}.options.theString"] // request, response, string
        }
    }
});

fluid.defaults("fluid.tests.express.priority.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing router ordering by priority...",
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
            type: "fluid.test.express.request",
            options: {
                endpoint: "whoWins"
            }
        },
        combinedRequest: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "combined"
            }
        }
    }
});

fluid.defaults("fluid.tests.express.priority.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7593,
    components: {
        express: {
            options: {
                components: {
                    // Confirming that the correct router gets the first shot at responding by surrounding it with
                    // wrong numbers.
                    tooSoon: {
                        type:      "fluid.tests.express.priority.stringOutputter",
                        options: {
                            priority:  "after:justInTime",
                            namespace: "tooSoon",
                            path:      "/whoWins",
                            theString: "Hello, too soon."
                        }
                    },
                    justInTime: {
                        type:      "fluid.tests.express.priority.stringOutputter",
                        options: {
                            priority:  "before:tooLate",
                            namespace: "justInTime",
                            path:      "/whoWins",
                            theString: "Hello, just in time."
                        }

                    },
                    tooLate: {
                        type:      "fluid.tests.express.priority.stringOutputter",
                        options: {
                            namespace: "tooLate",
                            path:      "/whoWins",
                            theString: "Hello, too late."
                        }
                    },
                    // A combination of middleware and routers that should spit out "Hello, ordered world." when hit in the right order.
                    combined: {
                        type: "fluid.express.router",
                        options: {
                            path:      "/combined",
                            components: {
                                lastWord: {
                                    type:      "fluid.tests.express.priority.stringOutputter",
                                    options: {
                                        priority:  "after:ordered",
                                        namespace: "lastWord",
                                        path:      "/",
                                        theString: " world."
                                    }
                                },
                                ordered: {
                                    type:      "fluid.tests.express.priority.oneStringMiddleware",
                                    options: {
                                        priority:  "after:hello",
                                        namespace: "ordered",
                                        theString: " ordered"
                                    }
                                },
                                hello: {
                                    type:      "fluid.tests.express.priority.oneStringMiddleware",
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
            type: "fluid.tests.express.priority.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.priority.testEnvironment");
