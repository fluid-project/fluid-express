// Tests for our query decoding integrated with Express
"use strict";
var fluid = require("infusion");

// TODO: Reviewing with Antranig, uncommenting this line results in lots of "assertion outside test context" errors when requiring this from another file.
// fluid.loadTestingSupport();

require("../../../");
fluid.express.loadTestingSupport();

var kettle = require("kettle");
kettle.loadTestingSupport();

require("./caseHolder");
require("./payloadTests");

fluid.registerNamespace("fluid.tests.express.querystring.withJsonQueryParser.caseHolder");

fluid.defaults("fluid.tests.express.querystring.withJsonQueryParser.request", {
    gradeNames: ["kettle.test.request.http"],
    path: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: [
                "%baseUrl%endpoint?%queryString",
                {
                    baseUrl: "{that}.options.baseUrl",
                    endpoint: "{that}.options.endpoint",
                    queryString: "@expand:fluid.express.querystring.encodeObject({that}.options.qs)"
                }
            ]
        }
    },
    endpoint: "loopback",
    qs: {},
    method: "GET"
});

fluid.tests.express.querystring.withJsonQueryParser.caseHolder.testPayload = function (that, payload) {
    that.currentExpected = payload;
    fluid.tests.express.querystring.withJsonQueryParser.request({
        qs: payload,
        baseUrl: that.options.baseUrl,
        port: that.options.port,
        listeners: {
            "onCreate.send": {
                func: "{that}.send",
                args: []
            }
        }
    });
};

fluid.defaults("fluid.tests.express.querystring.withJsonQueryParser.caseHolder", {
    gradeNames: ["fluid.tests.express.querystring.caseHolder", "fluid.test.express.caseHolder"],
    rawModules: [fluid.tests.express.payloadTests],
    port: "{testEnvironment}.options.port",
    baseUrl: "{testEnvironment}.options.baseUrl",
    // The choice was either to make another caseHolder with its own module resolver that duplicated bits of the standard express caseHolder wiring, or to do this.
    // TODO:  Discuss other approaches with Antranig.
    sequenceEnd: [{
        event:    "{testEnvironment}.express.loopback.events.onRequestReceived",
        listener: "jqUnit.assertDeepEq",
        args:     ["The JSON payload should be preserved...", "{caseHolder}.currentExpected", "{arguments}.0"]
    }],
    invokers: {
        testPayload: {
            funcName: "fluid.tests.express.querystring.withJsonQueryParser.caseHolder.testPayload",
            args:    ["{that}", "{arguments}.0"] // payload
        }
    }
});

fluid.defaults("fluid.tests.express.withJsonQueryParser.environment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    components: {
        express: {
            type: "fluid.express.withJsonQueryParser",
            options: {
                components: {
                    loopback: {
                        type: "fluid.test.express.loopbackMiddleware",
                        options: {
                            priority: "after:jsonQueryParser"
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "fluid.tests.express.querystring.withJsonQueryParser.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.withJsonQueryParser.environment");
