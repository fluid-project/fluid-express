/*

  Test the convenience caseholder we provide.  Wiring in sequence steps at the start of the sequence is well exercised
  by other tests in this package, these tests focus more on steps appended to the end of test sequences and on
  confirming that everything works end-to-end.

 */
"use strict";
var fluid  = require("infusion");

// TODO:  Replace this with a call to loadTestSupport
require("../lib/test-helpers");

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.helpers.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder.base"],
    sequenceStart: [
        // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
        {
            func: "{testEnvironment}.events.constructServer.fire"
        },
        {
            listener: "fluid.identity",
            event: "{testEnvironment}.events.onStarted"
        },
        {
            func: "jqUnit.expect",
            args: [2]
        },
        {
            func: "jqUnit.assert",
            args: ["Reached end of sequenceStart content added by addRequiredSequence..."]
        }
    ],
    sequenceEnd: [
        {
            func: "jqUnit.assert",
            args: ["Reached end of sequenceEnd content added by addRequiredSequence..."]
        }
    ],
    rawModules: [
        {
            tests: [
                {
                    name: "The test helpers should work end-to-end the first time...",
                    type: "test",
                    sequence: [
                    ]
                },
                {
                    name: "The test helpers should work end-to-end a second time...",
                    type: "test",
                    sequence: [
                    ]
                }
            ]
        }
    ]
});
