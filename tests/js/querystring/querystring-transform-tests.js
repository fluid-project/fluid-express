/*

    Tests for our query string en/d.transforms.

 */
"use strict";
var fluid = require("infusion");

require("../../../");

var jqUnit = require("node-jqunit");

require("./caseHolder");
require("./payloadTests");

fluid.registerNamespace("fluid.tests.express.querystring.transforms.caseHolder");

fluid.tests.express.querystring.transforms.caseHolder.testPayload = function (payload) {
    var encoded = fluid.model.transformWithRules(payload, {
        "": {
            transform: {
                type: "fluid.express.querystring.encodeTransform",
                inputPath: ""
            }
        }
    });

    var decoded = fluid.model.transformWithRules(encoded, {
        "": {
            transform: {
                type: "fluid.express.querystring.decodeTransform",
                inputPath: ""
            }
        }
    });

    jqUnit.assertDeepEq("The original value should be preserved after encoding and decoding...", payload, decoded);
};

// "extended" tests that do not fit our standard "round tripping" pattern.
fluid.tests.express.querystring.transforms.caseHolder.extendedTests = function () {
    var input    = "foo.bar&baz&qux.quux.corge";
    jqUnit.assertDeepEq("Values without a right-hand should become `true`...", { foo: { bar: true }, baz: true, qux: { quux: { corge: true }}}, fluid.express.querystring.decode(input));

    jqUnit.assertDeepEq("An empty object should be encoded as an empty query string...", "", fluid.express.querystring.encodeObject({}));

    jqUnit.assertDeepEq("An empty string should be decoded as an empty object...", {}, fluid.express.querystring.decode(""));

    jqUnit.expectFrameworkDiagnostic("Decoding a non-string should result in an error...", function () { fluid.express.querystring.decode({}); }, ["Can only decode strings."]);

    jqUnit.expectFrameworkDiagnostic("Encoding a non-object should result in an error...", function () { fluid.express.querystring.encodeObject("HCF"); }, ["Can only encode objects."]);
};

fluid.defaults("fluid.tests.express.querystring.transforms.caseHolder", {
    gradeNames: ["fluid.tests.express.querystring.caseHolder"],
    modules: [
        fluid.tests.express.payloadTests,
        {
            name: "Extended transform tests...",
            tests: [{
                name: "Test various asymmetric conditions that cannot be tested in the normal manner",
                expect: 3,
                sequence: [{
                    funcName: "fluid.tests.express.querystring.transforms.caseHolder.extendedTests"
                }]
            }]
        }
    ],
    invokers: {
        testPayload: {
            funcName: "fluid.tests.express.querystring.transforms.caseHolder.testPayload",
            args: ["{arguments}.0"] // payload
        }
    }
});

fluid.defaults("fluid.tests.express.querystring.transforms.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.express.querystring.transforms.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.querystring.transforms.testEnvironment");
