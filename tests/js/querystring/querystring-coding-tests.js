/* eslint-env node */
/*

    Tests for our query string en/decoding.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../../");

var jqUnit = require("node-jqunit");

require("./caseHolder");
require("./payloadTests");

fluid.registerNamespace("gpii.tests.express.querystring.coding.caseHolder");

gpii.tests.express.querystring.coding.caseHolder.testPayload = function (payload) {
    var encoded = gpii.express.querystring.encodeObject(payload);
    var decoded = gpii.express.querystring.decode(encoded);
    jqUnit.assertDeepEq("The original value should be preserved after encoding and decoding.", payload, decoded);
};

// "extended" tests that do not fit our standard "round tripping" pattern.
gpii.tests.express.querystring.coding.caseHolder.extendedTests = function () {
    var input    = "foo.bar&baz&qux.quux.corge";
    jqUnit.assertDeepEq("Values without a right-hand should become `true`...", { foo: { bar: true }, baz: true, qux: { quux: { corge: true }}}, gpii.express.querystring.decode(input));

    jqUnit.assertDeepEq("An empty object should be encoded as an empty query string...", "", gpii.express.querystring.encodeObject({}));

    jqUnit.assertDeepEq("An empty string should be decoded as an empty object...", {}, gpii.express.querystring.decode(""));

    jqUnit.expectFrameworkDiagnostic("Decoding a non-string should result in an error...", function () { gpii.express.querystring.decode({}); }, ["Can only decode strings."]);

    jqUnit.expectFrameworkDiagnostic("Encoding a non-object should result in an error...", function () { gpii.express.querystring.encodeObject("HCF"); }, ["Can only encode objects."]);
};

fluid.defaults("gpii.tests.express.querystring.coding.caseHolder", {
    gradeNames: ["gpii.tests.express.querystring.caseHolder"],
    modules: [
        gpii.tests.express.payloadTests,
        {
            name: "Extended en/decoding tests...",
            tests: [{
                name: "Test various asymmetric conditions that cannot be tested in the normal manner",
                expect: 3,
                sequence: [{
                    funcName: "gpii.tests.express.querystring.coding.caseHolder.extendedTests"
                }]
            }]
        }
    ],
    invokers: {
        testPayload: {
            funcName: "gpii.tests.express.querystring.coding.caseHolder.testPayload",
            args: ["{arguments}.0"] // payload
        }
    }
});

fluid.defaults("gpii.tests.express.querystring.coding.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.express.querystring.coding.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.querystring.coding.testEnvironment");
