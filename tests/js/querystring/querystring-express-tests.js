// Tests for our query decoding integrated with Express
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.loadTestingSupport();

require("../../../");
gpii.express.loadTestingSupport();

var kettle = require("kettle");
kettle.loadTestingSupport();

fluid.defaults("gpii.tests.express.withJsonQueryParser.request", {
    gradeNames: ["kettle.test.request.httpCookie"],
    path: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: [
                "%baseUrl%endpoint?%queryString",
                {
                    baseUrl: "{testEnvironment}.options.baseUrl",
                    endpoint: "{that}.options.endpoint",
                    queryString: "@expand:gpii.express.querystring.encodeObject({that}.options.qs)"
                }
            ]
        }
    },
    port: "{testEnvironment}.options.port",
    endpoint: "loopback",
    qs: {},
    method: "GET"
});

fluid.defaults("gpii.tests.express.withJsonQueryParser.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [{
        name: "Testing query decoding integration with express...",
        tests: [
            {
                name: "A complex query string should be handled correctly...",
                type: "test",
                sequence: [
                    {
                        func: "{complexQueryRequest}.send"
                    },
                    {
                        event:    "{testEnvironment}.express.loopback.events.onRequestReceived",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The JSON payload should have been preserved...", "{complexQueryRequest}.options.qs", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "An empty query string should be handled correctly...",
                type: "test",
                sequence: [
                    {
                        func: "{emptyQueryRequest}.send"
                    },
                    {
                        event:    "{testEnvironment}.express.loopback.events.onRequestReceived",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The resulting JSON payload should be an empty object...", "{emptyQueryRequest}.options.qs", "{arguments}.0"]
                    }
                ]
            }
        ]
    }],
    components: {
        complexQueryRequest: {
            type: "gpii.tests.express.withJsonQueryParser.request",
            options: {
                qs: {
                    rootString: "root string value",
                    rootNumber: 1,
                    middle: {
                        middleString: "middle string value",
                        middleNumber: 2,
                        bottom: {
                            bottomString: "bottom string value",
                            bottomNumber: 3.1415926
                        }
                    }
                }
            }
        },
        emptyQueryRequest: {
            type: "gpii.tests.express.withJsonQueryParser.request"
        }
    }
});

fluid.defaults("gpii.tests.express.withJsonQueryParser.environment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    components: {
        express: {
            type: "gpii.express.withJsonQueryParser",
            options: {
                components: {
                    loopback: {
                        type: "gpii.test.express.loopbackMiddleware"
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.express.withJsonQueryParser.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.withJsonQueryParser.environment");