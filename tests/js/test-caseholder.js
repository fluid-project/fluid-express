/* Tests for the "express" and "router" module */
"use strict";
var fluid        = fluid || require("infusion");
var gpii         = fluid.registerNamespace("gpii");
var jqUnit       = require("jqUnit");

fluid.registerNamespace("gpii.express.tests.expressTestCaseHolder");

fluid.setLogging(true);

gpii.express.tests.expressTestCaseHolder.isSaneResponse = function (response, body) {

    jqUnit.assertEquals("The response should have a reasonable status code", 200, response.statusCode);
    if (response.statusCode !== 200) {
        console.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertValue("There should be a body.", body);
};

gpii.express.tests.expressTestCaseHolder.assembleUrl = function (baseUrl, path) {
    var fullPath;
    // We have to be careful of double slashes (or no slashes)
    if (baseUrl[baseUrl.length - 1] === "/" && path[0] === "/") {
        fullPath = baseUrl + path.substring(1);

    }
    else if (baseUrl[baseUrl.length - 1] !== "/" && path[0] !== "/") {
        fullPath = baseUrl + "/" + path;
    }
    else {
        fullPath = baseUrl + path;
    }
    return fullPath;
};

gpii.express.tests.expressTestCaseHolder.verifyContent = function (response, body, expectedString) {

    gpii.express.tests.expressTestCaseHolder.isSaneResponse(response, body);

    jqUnit.assertTrue("The body should match the custom content...", body.indexOf(expectedString !== -1));
};

gpii.express.tests.expressTestCaseHolder.verifyMiddlewareIsolation = function (response, body) {

    gpii.express.tests.expressTestCaseHolder.isSaneResponse(response, body);

    var data = JSON.parse(body);

    jqUnit.assertUndefined("The returned data should not contain session content from the sibling's middleware...", data.session);
    jqUnit.assertUndefined("The returned data should not contain cookie content from a child's middleware...", data.cookies);
};

gpii.express.tests.expressTestCaseHolder.verifyWildcard = function (response, body) {

    gpii.express.tests.expressTestCaseHolder.isSaneResponse(response, body);

    jqUnit.assertEquals("The nested body should match the configured content...", "Hello, wild world.", body);
};

// This test does not need to see the request per se, only the test environment after at least one request has gone through.
gpii.express.tests.expressTestCaseHolder.testCounterMiddleware = function (that) {
    jqUnit.assertTrue("The counter should be greater than one...", that.express.middleware.model.count > 1);
};

gpii.express.tests.expressTestCaseHolder.testCookieMiddleware = function (response, body) {

    gpii.express.tests.expressTestCaseHolder.isSaneResponse(response, body);

    jqUnit.assertNotNull("There should be cookie data...", body.cookies);
    if (body.cookies) {
        jqUnit.assertNotNull("There should be a 'foo' cookie set...", body.cookies.foo);
    }
};

gpii.express.tests.expressTestCaseHolder.testSessionMiddleware = function (response, body) {

    gpii.express.tests.expressTestCaseHolder.isSaneResponse(response, body);

    jqUnit.assertNotNull("There should be session data...", body.session);
    if (body.session) {
        jqUnit.assertNotNull("There should be a 'lastAccess' session variable set...", body.session.lastAccess);
    }
};

gpii.express.tests.expressTestCaseHolder.testBodyParserMiddleware = function (response, body) {

    gpii.express.tests.expressTestCaseHolder.isSaneResponse(response, body);

    jqUnit.assertNotNull("There should be body data...", body.body);
    if (body.body) {
        jqUnit.assertNotNull("There should be a 'foo' body params variable set...", body.body.foo);
    }
};

gpii.express.tests.expressTestCaseHolder.testExpressShutdown = function (error) {
    jqUnit.assertNotNull("There should be an error returned.", error);
    jqUnit.assertEquals("The connection should have been refused.", "ECONNREFUSED", error.code);
};


// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.expressTestCaseHolder", {
    gradeNames: ["autoInit", "fluid.test.testCaseHolder"],
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
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
                        funcName: "gpii.express.tests.expressTestCaseHolder.assembleUrl",
                        args:     ["{testEnvironment}.options.baseUrl", "/reqview"]
                    }
                },
                port: "{testEnvironment}.options.port",
                method: "GET"
            }
        }
    },
    modules: [
        {
            tests: [
                {
                    name: "Testing the 'static' router module (index content)...",
                    type: "test",
                    sequence: [
                        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                            func: "{testEnvironment}.events.constructServer.fire"
                        },
                        {
                            listener: "fluid.identity",
                            event: "{testEnvironment}.events.onStarted"
                        },
                        {
                            func: "{staticRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.verifyContent",
                            event: "{staticRequest}.events.onComplete",
                            args: ["{staticRequest}.nativeResponse", "{arguments}.0", "body of the index"]
                        }
                    ]
                },
                {
                    name: "Testing the 'static' router module (custom content)...",
                    type: "test",
                    sequence: [
                        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                            func: "{testEnvironment}.events.constructServer.fire"
                        },
                        {
                            listener: "fluid.identity",
                            event: "{testEnvironment}.events.onStarted"
                        },
                        {
                            func: "{staticCustomRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.verifyContent",
                            event: "{staticCustomRequest}.events.onComplete",
                            args: ["{staticCustomRequest}.nativeResponse", "{arguments}.0", "custom page"]
                        }
                    ]
                },
                {
                    name: "Testing router nesting and middleware isolation...",
                    type: "test",
                    sequence: [
                        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                            func: "{testEnvironment}.events.constructServer.fire"
                        },
                        {
                            listener: "fluid.identity",
                            event: "{testEnvironment}.events.onStarted"
                        },
                        {
                            func: "{helloRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.verifyContent",
                            event: "{helloRequest}.events.onComplete",
                            args: ["{helloRequest}.nativeResponse", "{arguments}.0", "Hello, World"]
                        },
                        {
                            func: "{helloWorldRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.verifyContent",
                            event: "{helloWorldRequest}.events.onComplete",
                            args: ["{helloWorldRequest}.nativeResponse", "{arguments}.0", "Hello, yourself"]
                        },
                        {
                            func: "{middlewareIsolationRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.verifyMiddlewareIsolation",
                            event: "{middlewareIsolationRequest}.events.onComplete",
                            args: ["{middlewareIsolationRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing the 'wildcard' router module (index content)...",
                    type: "test",
                    sequence: [
                        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                            func: "{testEnvironment}.events.constructServer.fire"
                        },
                        {
                            listener: "fluid.identity",
                            event: "{testEnvironment}.events.onStarted"
                        },
                        {
                            func: "{wildcardRootRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.verifyWildcard",
                            event: "{wildcardRootRequest}.events.onComplete",
                            args: ["{wildcardRootRequest}.nativeResponse", "{arguments}.0"]
                        },
                        {
                            func: "{wildcardDeepRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.verifyWildcard",
                            event: "{wildcardDeepRequest}.events.onComplete",
                            args: ["{wildcardDeepRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing the 'counter' middleware module...",
                    type: "test",
                    sequence: [
                        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                            func: "{testEnvironment}.events.constructServer.fire"
                        },
                        {
                            listener: "fluid.identity",
                            event: "{testEnvironment}.events.onStarted"
                        },
                        {
                            func: "{staticRequest}.send"
                        },
                        {
                            listener: "{counterRequest}.send",
                            event: "{staticRequest}.events.onComplete"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.testCounterMiddleware",
                            event: "{counterRequest}.events.onComplete",
                            args: ["{testEnvironment}"]
                        }
                    ]
                },
                {
                    name: "Testing the 'session' middleware module...",
                    type: "test",
                    sequence: [
                        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                            func: "{testEnvironment}.events.constructServer.fire"
                        },
                        {
                            listener: "fluid.identity",
                            event: "{testEnvironment}.events.onStarted"
                        },
                        {
                            func: "{sessionRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.testSessionMiddleware",
                            event: "{sessionRequest}.events.onComplete",
                            args: ["{wildcardDeepRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing the 'body parser' middleware module...",
                    type: "test",
                    sequence: [
                        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                            func: "{testEnvironment}.events.constructServer.fire"
                        },
                        {
                            listener: "fluid.identity",
                            event: "{testEnvironment}.events.onStarted"
                        },
                        {
                            func: "{bodyParserRequest}.send",
                            args: [{ foo: "bar" }]
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.testBodyParserMiddleware",
                            event: "{bodyParserRequest}.events.onComplete",
                            args: ["{wildcardDeepRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Testing the 'cookie' middleware module...",
                    type: "test",
                    sequence: [
                        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                            func: "{testEnvironment}.events.constructServer.fire"
                        },
                        {
                            listener: "fluid.identity",
                            event: "{testEnvironment}.events.onStarted"
                        },
                        {
                            func: "{cookieSetRequest}.send"
                        },
                        {
                            listener: "{cookieReadRequest}.send",
                            event: "{cookieSetRequest}.events.onComplete"
                        },
                        {
                            listener: "gpii.express.tests.expressTestCaseHolder.testCookieMiddleware",
                            event: "{cookieReadRequest}.events.onComplete",
                            args: ["{cookieReadRequest}.nativeResponse", "{arguments}.0"]
                        }
                    ]
                }
            ]
        }
    ]
});
