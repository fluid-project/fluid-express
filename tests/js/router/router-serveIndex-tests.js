/*

    Tests for our wrapper surrounding the Express "serve-index" middleware.

 */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../includes");

fluid.registerNamespace("gpii.tests.express.router.serveIndex");

gpii.tests.express.router.serveIndex.testDirectoryIndex = function (response, body, expectedContent, unexpectedContent, expectedStatusCode) {
    expectedStatusCode = expectedStatusCode || 200;
    jqUnit.assertEquals("The status code should have been as expected.", expectedStatusCode, response.statusCode);

    if (expectedContent) {
        fluid.each(fluid.makeArray(expectedContent), function (singleExpectedItem) {
            jqUnit.assertTrue("We should have found the string '" + singleExpectedItem + "'.", body.indexOf(singleExpectedItem) !== -1);
        });
    }
    if (unexpectedContent) {
        fluid.each(fluid.makeArray(unexpectedContent), function (singleUnexpectedItem) {
            jqUnit.assertTrue("We should not have found the string '" + singleUnexpectedItem + "'.", body.indexOf(singleUnexpectedItem) === -1);
        });
    }
};

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.tests.express.router.serveIndex.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing 'serveIndex' middleware...",
            tests: [
                {
                    name: "We should be able to load a generated index for a single directory.",
                    type: "test",
                    sequence: [
                        {
                            func: "{serveIndexRootIndexRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.router.serveIndex.testDirectoryIndex",
                            event:    "{serveIndexRootIndexRequest}.events.onComplete",
                            // response, body, expectedContent, unexpectedContent, expectedStatusCode
                            args:     [
                                "{serveIndexRootIndexRequest}.nativeResponse",
                                "{arguments}.0",
                                ["custom.html", "index.html"],
                                ["body of the index"]
                            ]
                        }
                    ]
                },
                {
                    name: "We should be able to reach content beyond the generated index.",
                    type: "test",
                    sequence: [
                        {
                            func: "{serveIndexRootContentRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.router.serveIndex.testDirectoryIndex",
                            event:    "{serveIndexRootContentRequest}.events.onComplete",
                            // response, body, expectedContent, unexpectedContent, expectedStatusCode
                            args:     [
                                "{serveIndexRootContentRequest}.nativeResponse",
                                "{arguments}.0",
                                ["body of the index"],
                                ["custom.html"]
                            ]
                        }
                    ]
                },
                {
                    name: "We should be able to load a generated index for multiple directories of content hosted from a single endpoint.",
                    type: "test",
                    sequence: [
                        {
                            func: "{serveIndexMultipleDirectoryIndexRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.router.serveIndex.testDirectoryIndex",
                            event:    "{serveIndexMultipleDirectoryIndexRequest}.events.onComplete",
                            // response, body, expectedContent, unexpectedContent, expectedStatusCode
                            args:     [
                                "{serveIndexMultipleDirectoryIndexRequest}.nativeResponse",
                                "{arguments}.0",
                                ["primary.json", "secondary.json"],
                                ["index.html"]
                            ]
                        }
                    ]
                }
            ]
        }
        // TODO: Confirm that the index works for multiple directories.
        // TODO: Confirm that multi directory content is available.
        // TODO: Confirm that a 404 works within a path handled by the middleware..
    ],
    components: {
        serveIndexRootIndexRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: ""
            }
        },
        serveIndexRootContentRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "index.html"
            }
        },
        serveIndexMultipleDirectoryIndexRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "multiple/"
            }
        }
    }
});

fluid.defaults("gpii.tests.express.router.serveIndex.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:   7432,
    components: {
        express: {
            options: {
                components: {
                    serveIndexMultiplePaths: {
                        type: "gpii.express.router.serveContentAndIndex",
                        options: {
                            priority: "before:serveIndexSinglePath",
                            path:    "/multiple",
                            content: ["%gpii-express/tests/data/secondary", "%gpii-express/tests/data/primary"]
                        }
                    },
                    serveIndexSinglePath: {
                        type: "gpii.express.router.serveContentAndIndex",
                        options: {
                            path:    "/",
                            staticMiddlewareOptions: { index: false },
                            content: "%gpii-express/tests/html"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.router.serveIndex.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.router.serveIndex.testEnvironment");
