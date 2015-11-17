/* Tests for the router grade and the "wrapper" modules for common Express routers.  */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("jqUnit");

require("../lib/test-helpers");

fluid.registerNamespace("gpii.express.tests.router.caseHolder");

gpii.express.tests.router.caseHolder.verifyContent = function (response, body, expectedString) {

    gpii.express.tests.helpers.isSaneResponse(response, body);

    jqUnit.assertTrue("The body should match the custom content...", body.indexOf(expectedString !== -1));
};

gpii.express.tests.router.caseHolder.verifyWildcard = function (response, body) {

    gpii.express.tests.helpers.isSaneResponse(response, body);

    jqUnit.assertEquals("The nested body should match the configured content...", "Hello, wild world.", body);
};

gpii.express.tests.router.caseHolder.verifyParams = function (response, body) {
    gpii.express.tests.helpers.isSaneResponse(response, body);

    jqUnit.assertTrue("The response should contain the variable data...", body.indexOf("fooBar") !== -1);
};

gpii.express.tests.router.caseHolder.verifyDeepParams = function (response, body) {
    gpii.express.tests.helpers.isSaneResponse(response, body);

    var data = typeof body === "string" ? JSON.parse(body) : body;
    jqUnit.assertDeepEq("The response should contain the upstream parameter data...", { myVar: "fooBar"}, data.params);
};


fluid.defaults("gpii.express.tests.router.caseHolder.request", {
    gradeNames: ["kettle.test.request.http"],
    path: {
        expander: {
            funcName: "fluid.stringTemplate",
            args:     ["%baseUrl%endpoint", { baseUrl: "{testEnvironment}.options.baseUrl", endpoint: "{that}.options.endpoint"}]
        }
    },
    port: "{testEnvironment}.options.port",
    method: "GET"
});

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.router.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
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
                    name: "Testing the 'params' router module (top level)...",
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
                },
                {
                    name: "Testing the 'params' router module (deep)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{deepParamsRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.router.caseHolder.verifyDeepParams",
                            event: "{deepParamsRequest}.events.onComplete",
                            args: ["{deepParamsRequest}.nativeResponse", "{arguments}.0"]
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
            type: "gpii.express.tests.router.caseHolder.request",
            options: {
                endpoint: ""
            }
        },
        staticCustomRequest: {
            type: "gpii.express.tests.router.caseHolder.request",
            options: {
                endpoint: "custom.html"
            }
        },
        helloRequest: {
            type: "gpii.express.tests.router.caseHolder.request",
            options: {
                endpoint: "hello"
            }
        },
        helloWorldRequest: {
            type: "gpii.express.tests.router.caseHolder.request",
            options: {
                endpoint: "hello/world"
            }
        },
        wildcardRootRequest: {
            type: "gpii.express.tests.router.caseHolder.request",
            options: {
                endpoint: "wildcard/"
            }
        },
        wildcardDeepRequest: {
            type: "gpii.express.tests.router.caseHolder.request",
            options: {
                endpoint: "wildcard/many/levels/deep"
            }
        },
        paramsRequest: {
            type: "gpii.express.tests.router.caseHolder.request",
            options: {
                endpoint: "params/fooBar"
            }
        },
        deepParamsRequest: {
            type: "gpii.express.tests.router.caseHolder.request",
            options: {
                endpoint: "params/fooBar/deep"
            }
        }
    }
});
