/* eslint-env node */
// Tests for the `urlEncodedJson` dataSource grade.
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.express.loadTestingSupport();

var kettle = require("kettle");
kettle.loadTestingSupport();

// Our local test dataSource grade that is aware of our starting URL (loopback)
fluid.defaults("gpii.tests.express.querystring.dataSource.dataSource", {
    gradeNames: ["gpii.express.dataSource.urlEncodedJson"],
    endpoint: "loopback",
    url: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["%baseUrl%endpoint", {
                baseUrl: "{testEnvironment}.options.baseUrl",
                endpoint: "{that}.options.endpoint"
            }]
        }
    }
});


fluid.defaults("gpii.tests.express.querystring.dataSource.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [{
        name: "Tests for the `urlEncodedJsonReader` dataSource grade...",
        tests: [
            {
                name: "We should be able to send a JSON payload to the server via the dataSource query string...",
                type: "test",
                sequence: [
                    {
                        func: "{normalDatasource}.get",
                        args: ["{testEnvironment}.options.input.success"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event: "{testEnvironment}.express.loopback.events.onRequestReceived",
                        args: ["The JSON payload should have been received by the server...", "{testEnvironment}.options.expected.success", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "We should be able to make a request with an empty JSON payload...",
                type: "test",
                sequence: [
                    {
                        func: "{normalDatasource}.get",
                        args: ["{testEnvironment}.options.input.empty"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event: "{testEnvironment}.express.loopback.events.onRequestReceived",
                        args: ["The JSON payload should have been received by the server...", "{testEnvironment}.options.expected.empty", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "We should be able to omit the payload altogether...",
                type: "test",
                sequence: [
                    {
                        func: "{normalDatasource}.get",
                        args: []
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event: "{testEnvironment}.express.loopback.events.onRequestReceived",
                        args: ["The JSON payload should have been received by the server...", "{testEnvironment}.options.expected.empty", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "It should be possible to encode values without stringifying them...",
                type: "test",
                sequence: [
                    {
                        func: "{avoidStringifying}.get",
                        args: ["{testEnvironment}.options.input.avoidStringifying"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event: "{testEnvironment}.express.rawLoopback.events.onRequestReceived",
                        args: ["The JSON payload should have been received by the server...", "{testEnvironment}.options.expected.avoidStringifying", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Attempting to use the grade with existing query data should result in an error...",
                type: "test",
                sequence: [
                    {
                        funcName: "kettle.test.pushInstrumentedErrors",
                        args: ["gpii.test.notifyGlobalError"]
                    },
                    {
                        func: "{existingQueryDataDatasource}.get",
                        args: []
                    },
                    {
                        event: "{globalErrorHandler}.events.onError",
                        listener: "gpii.test.awaitGlobalError"
                    },
                    {
                        funcName: "kettle.test.popInstrumentedErrors"
                    }
                ]
            }
        ]
    }],
    components: {
        normalDatasource: {
            type: "gpii.tests.express.querystring.dataSource.dataSource"
        },
        avoidStringifying: {
            type: "gpii.tests.express.querystring.dataSource.dataSource",
            options: {
                avoidStringifying: true,
                endpoint: "rawLoopback"
            }
        },
        existingQueryDataDatasource: {
            type: "gpii.tests.express.querystring.dataSource.dataSource",
            options: {
                endpoint: "loopback?hasData=true"
            }
        }
    }
});

fluid.defaults("gpii.tests.express.querystring.dataSource.environment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port: "9595",
    input: {
        empty: {},
        success: {
            topLevelString: "foo",
            topLevelUndefined: undefined,
            topLevelNull: null,
            deep: {
                deepArray: ["quux", 0, false, null],
                deepNull: null,
                deepUndefined: undefined,
                evenDeeper: {
                    deepest: true,
                    deeplyNull: null,
                    deeplyUndefined: undefined
                }
            },
            topLevelArray: [0, 1, 2]

        },
        avoidStringifying: {
            q: "foo AND (status:bar OR status:baz)"
        }
    },
    expected: {
        empty: {},
        success: {
            topLevelString: "foo",
            topLevelNull: null,
            deep: {
                deepArray: ["quux", 0, false, null],
                deepNull: null,
                evenDeeper: {
                    deepest: true,
                    deeplyNull: null
                }
            },
            topLevelArray: [0, 1, 2]
        },
        avoidStringifying: {
            q: "foo AND (status:bar OR status:baz)"
        }
    },
    components: {
        express: {
            options: {
                components: {
                    rawLoopback: {
                        type: "gpii.test.express.loopbackMiddleware",
                        options: {
                            path: "/rawLoopback",
                            priority: "before:jsonQueryParser"
                        }
                    },
                    jsonQueryParser: {
                        type: "gpii.express.middleware.withJsonQueryParser"
                    },
                    loopback: {
                        type: "gpii.test.express.loopbackMiddleware",
                        options: {
                            priority: "after:jsonQueryParser"
                        }
                    }

                }
            }
        },
        caseHolder: {
            type: "gpii.tests.express.querystring.dataSource.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.querystring.dataSource.environment");
