/*

    Test the static function `gpii.express.orderByPriority` we use to control the order in which middleware and routers
    are wired into our express instance.


 */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");

require("../../../");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.express.tests.orderByPriority");
gpii.express.tests.orderByPriority.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var output = gpii.express.orderByPriority(testDef.input);

        jqUnit.assertEquals(testDef.message + " (length check)", testDef.expected.length, output.length);
        for (var a = 0; a  < testDef.expected.length; a++) {
            // The resolved `priority` value will be different than the original, so we use an `assertLeftHand` comparison here.
            jqUnit.assertLeftHand(testDef.message + "(equality check #" + a + ")", testDef.expected[a], output[a]);
        }
    });
};

fluid.defaults("gpii.express.tests.orderByPriority", {
    gradeNames: ["fluid.component"],
    tests: [
        {
            message:  "An array should be ordered as expected...",
            input:    [
                {
                    priority:  "after:two",
                    namespace: "three"
                },
                {
                    namespace: "two"
                },
                {
                    priority:  "before:two",
                    namespace: "one"
                }
            ],
            expected: [
                {
                    namespace: "one"
                },
                {
                    namespace: "two"
                },
                {
                    namespace: "three"
                }
            ]
        },
        {
            message:  "A map should be ordered as expected...",
            input:    {
                three: {
                    priority:  "after:two",
                    namespace: "three"
                },
                two: {
                    namespace: "two"
                },
                one: {
                    priority:  "before:two",
                    namespace: "one"
                }
            },
            expected: [
                {
                    namespace: "one"
                },
                {
                    namespace: "two"
                },
                {
                    namespace: "three"
                }
            ]
        }
    ],
    listeners: {
        "onCreate.announceModule": {
            funcName: "jqUnit.module",
            args: ["Testing the static function that orders routers and middleware by priority..."]
        },
        "onCreate.runAllTests": {
            funcName: "fluid.each",
            args: ["{that}.options.tests", gpii.express.tests.orderByPriority.runSingleTest]
        }
    }
});

gpii.express.tests.orderByPriority();