/* Tests for the router grade and the "wrapper" modules for common Express routers.  */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");
var jqUnit       = require("jqUnit");

require("../lib/test-helpers");

fluid.registerNamespace("gpii.express.tests.router.caseHolder");

fluid.setLogging(true);

gpii.express.tests.router.caseHolder.verifyContent = function (response, body, expectedString) {

    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body);

    jqUnit.assertTrue("The body should match the custom content...", body.indexOf(expectedString !== -1));
};

gpii.express.tests.router.caseHolder.verifyWildcard = function (response, body) {

    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body);

    jqUnit.assertEquals("The nested body should match the configured content...", "Hello, wild world.", body);
};

gpii.express.tests.router.caseHolder.verifyParams = function (response, body) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body);

    jqUnit.assertTrue("The response should contain the variable data...", body.indexOf("fooBar") !== -1);
};

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.router.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
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
                    name: "Testing the 'static' router module (index content)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{staticRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.router.caseHolder.verifyContent",
                            event: "{staticRequest}.events.onComplete",
                            args: ["{staticRequest}.nativeResponse", "{arguments}.0", "body of the index"]
                        }
                    ]
                },
                {
                    name: "Testing the 'static' router module (custom content)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{staticCustomRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.router.caseHolder.verifyContent",
                            event: "{staticCustomRequest}.events.onComplete",
                            args: ["{staticCustomRequest}.nativeResponse", "{arguments}.0", "custom page"]
                        }
                    ]
                },
                {
                    name: "Testing router nesting...",
                    type: "test",
                    sequence: [
                        {
                            func: "{helloRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.router.caseHolder.verifyContent",
                            event: "{helloRequest}.events.onComplete",
                            args: ["{helloRequest}.nativeResponse", "{arguments}.0", "Hello, World"]
                        },
                        {
                            func: "{helloWorldRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.router.caseHolder.verifyContent",
                            event: "{helloWorldRequest}.events.onComplete",
                            args: ["{helloWorldRequest}.nativeResponse", "{arguments}.0", "Hello, yourself"]
                        }
                    ]
                },
                {
                    name: "Testing the 'wildcard' router module (index content)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{wildcardRootRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.router.caseHolder.verifyWildcard",
                            event: "{wildcardRootRequest}.events.onComplete",
                            args: ["{wildcardRootRequest}.nativeResponse", "{arguments}.0"]
                        },
                        {
                            func: "{wildcardDeepRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.router.caseHolder.verifyWildcard",
                            event: "{wildcardDeepRequest}.events.onComplete",
                            args: ["{wildcardDeepRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing the 'params' router module...",
                    type: "test",
                    sequence: [
                        {
                            func: "{paramsRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.router.caseHolder.verifyParams",
                            event: "{paramsRequest}.events.onComplete",
                            args: ["{paramsRequest}.nativeResponse", "{arguments}.0"]
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
        paramsRequest: {
            type: "kettle.test.request.http",
            options: {
                path: {
                    expander: {
                        funcName: "gpii.express.tests.helpers.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/params/fooBar"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        }
    }
});
