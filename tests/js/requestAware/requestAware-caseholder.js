/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");
var jqUnit       = require("jqUnit");

require("../lib/test-helpers");

fluid.registerNamespace("gpii.express.tests.requestAware.caseHolder");

fluid.setLogging(true);


gpii.express.tests.requestAware.caseHolder.testSessionAwareDelayedResponse = function (response, body) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 200);
};

gpii.express.tests.requestAware.caseHolder.testSessionAwareTimeoutResponse = function (response, body) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 500);
};

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.requestAware.caseHolder", {
    gradeNames: ["autoInit", "fluid.test.testCaseHolder"],
    mergePolicy: {
        rawModules:    "noexpand",
        sequenceStart: "noexpand"
    },
    moduleSource: {
        funcName: "gpii.express.tests.helpers.addRequiredSequences",
        args:     ["{that}.options.sequenceStart", "{that}.options.rawModules"]
    },
    sequenceStart: [
        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
            func: "{testEnvironment}.events.constructServer.fire"
        },
        {
            listener: "fluid.identity",
            event: "{testEnvironment}.events.onStarted"
        }
    ],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing the 'request aware' abstract component...",
                    type: "test",
                    sequence: [
                        {
                            func: "{requestAwareDelayedRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.requestAware.caseHolder.testSessionAwareDelayedResponse",
                            event:    "{requestAwareDelayedRequest}.events.onComplete",
                            args:     ["{requestAwareDelayedRequest}.nativeResponse", "{arguments}.0"]
                        },
                        {
                            func: "{requestAwareTimeoutRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.requestAware.caseHolder.testSessionAwareTimeoutResponse",
                            event:    "{requestAwareTimeoutRequest}.events.onComplete",
                            args:     ["{requestAwareTimeoutRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        cookieJar: {
            type: "kettle.test.cookieJar"
        },
        staticRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "{testEnvironment}.options.baseUrl",
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        counterRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "{testEnvironment}.options.baseUrl",
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        staticCustomRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "custom.html"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        helloRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/hello"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        helloWorldRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/hello/world"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        middlewareIsolationRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/hello/rv"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        wildcardRootRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/wildcard/"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        wildcardDeepRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/wildcard/many/levels/deep"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        cookieSetRequest: {
            type: "kettle.test.request.httpCookie",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/cookie"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        cookieReadRequest: {
            type: "kettle.test.request.httpCookie",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/reqview"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        sessionRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/reqview"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        bodyParserRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/reqview"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        requestAwareDelayedRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/requestAware?action=delayed"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        },
        requestAwareTimeoutRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/requestAware?action=timeout"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        }
    }
});
