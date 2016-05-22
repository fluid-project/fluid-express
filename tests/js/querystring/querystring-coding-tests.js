/*

    Tests for our query string en/decoding.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../../");

var jqUnit = require("node-jqunit");
jqUnit.module("Testing query string encoding and decoding...");


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
    jqUnit.test("Testing decoding of fields without a value...", function () {
        var input    = "foo.bar&baz&qux.quux.corge";
        var output   = gpii.express.querystring.decode(input);
        var expected = { foo: { bar: true }, baz: true, qux: { quux: { corge: true }}};
        jqUnit.assertDeepEq("Values without a right-hand should become `true`...", expected, output);
    });

    jqUnit.test("Test encoding of empty payloads...", function () {
        var input    = {};
        var output   = gpii.express.querystring.encodeObject(input);
        var expected = "";
        jqUnit.assertDeepEq("An empty object should be encoded as an empty query string...", expected, output);
    });

    jqUnit.test("Test decoding of empty strings...", function () {
        var input    = "";
        var output   = gpii.express.querystring.decode(input);
        var expected = {};
        jqUnit.assertDeepEq("An empty string should be decoded as an empty object...", expected, output);
    });
};

fluid.defaults("gpii.tests.express.querystring.coding.caseHolder", {
    gradeNames: ["gpii.tests.express.querystring.caseHolder"],
    modules: [
        gpii.tests.express.payloadTests,
        {
            name: "Extended en/decoding tests...",
            tests: [{
                name: "Test various asymmetric conditions that cannot be tested in the normal manner",
                expect: 0,
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