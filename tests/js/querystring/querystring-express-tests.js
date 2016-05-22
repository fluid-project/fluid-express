// Tests for our query decoding integrated with Express
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.loadTestingSupport();

var jqUnit = require("node-jqunit");

require("../../../");
gpii.express.loadTestingSupport();

var kettle = require("kettle");
kettle.loadTestingSupport();

require("./caseHolder");
require("./payloadTests");

fluid.registerNamespace("gpii.tests.express.querystring.withJsonQueryParser.caseHolder");

fluid.defaults("gpii.tests.express.querystring.withJsonQueryParser.request", {
    gradeNames: ["kettle.test.request.http"],
    path: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: [
                "%baseUrl%endpoint?%queryString",
                {
                    baseUrl: "{that}.options.baseUrl",
                    endpoint: "{that}.options.endpoint",
                    queryString: "@expand:gpii.express.querystring.encodeObject({that}.options.qs)"
                }
            ]
        }
    },
    endpoint: "loopback",
    qs: {},
    method: "GET"
});

gpii.tests.express.querystring.withJsonQueryParser.caseHolder.testPayload = function (that, payload) {
    that.currentExpected = payload;
    gpii.tests.express.querystring.withJsonQueryParser.request({
        qs: payload,
        baseUrl: that.options.baseUrl,
        port: that.options.port,
        listeners: {
            "onCreate.send": {
                func: "{that}.send"
            }
        }
    });
};

fluid.defaults("gpii.tests.express.querystring.withJsonQueryParser.caseHolder", {
    gradeNames: ["gpii.tests.express.querystring.caseHolder", "gpii.test.express.caseHolder"],
    rawModules: [gpii.tests.express.payloadTests],
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
            funcName: "gpii.tests.express.querystring.withJsonQueryParser.caseHolder.testPayload",
            args:    ["{that}", "{arguments}.0"] // payload
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
                        type: "gpii.test.express.loopbackMiddleware",
                        options: {
                            priority: "after:jsonQueryParser"
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.express.querystring.withJsonQueryParser.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.withJsonQueryParser.environment");