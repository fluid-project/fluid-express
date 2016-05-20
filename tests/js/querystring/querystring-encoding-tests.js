/*

    Tests for our query string en/decoding.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../../");

var jqUnit = require("node-jqunit");

jqUnit.module("Testing query string encoding and decoding...");

fluid.registerNamespace("gpii.tests.express.querystring.testRunner");
gpii.tests.express.querystring.testRunner.runSingleTest = function (testDef) {
    jqUnit.test(testDef.name, function () {
        var encoded = gpii.express.querystring.encodeObject(testDef.payload);
        var decoded = gpii.express.querystring.decode(encoded);
        jqUnit.assertDeepEq("The original value should be preserved after encoding and decoding.", testDef.payload, decoded);
    });
};

// "extended" tests that do not fit our standard "round tripping" pattern.
gpii.tests.express.querystring.testRunner.extendedTests = function () {
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


fluid.defaults("gpii.tests.express.querystring.testRunner", {
    gradeNames: ["fluid.component"],
    tests: [
        {
            name: "An array should be encoded correctly...",
            payload: { array: ["foo", 1, 0, true, false, 1.21 ] }
        },
        {
            name: "An field which consists of an empty array should be encoded correctly...",
            payload: { emptyArray: [] }
        },
        {
            name: "An field which consists of an empty object should be encoded correctly...",
            payload: { emptyObject: {} }
        },
        {
            // `undefined` is not on the list as it is implicitly converted to `null` by `JSON.parse`, and would not survive the roundtrip testing we use here.
            name: "`falsy` values should be encoded correctly...",
            payload: {
                zero:  0,
                falsy: false,
                nully: null
            }
        },
        {
            name: "A string should be encoded correctly...",
            payload: { string: "here we are now" }
        },
        {
            name: "A number with decimal data should be encoded correctly...",
            payload: { pi: Math.PI }
        },
        {
            name: "An integer should be encoded correctly...",
            payload: { integer: 42 }
        },
        {
            name: "A deep structure should be encoded correctly...",
            payload: {
                root: {
                    rootString: "root string value",
                    rootNumber: 1,
                    middle: {
                        middleString: "middle string value",
                        middleNumber: 2,
                        bottom: {
                            bottomString: "bottom string value",
                            bottomNumber: 3
                        }
                    }
                }
            }
        }
    ],
    listeners: {
        "onCreate.runStandardTests": {
            funcName: "fluid.each",
            args:     ["{that}.options.tests", gpii.tests.express.querystring.testRunner.runSingleTest]
        },
        "onCreate.runExtendedTests": {
            priority: "after:runStandardTests",
            funcName: "gpii.tests.express.querystring.testRunner.extendedTests"
        }
    }
});

gpii.tests.express.querystring.testRunner();