"use strict";
var fluid  = require("infusion");

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.tests.express.passthroughRouter.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing top level...",
                    type: "test",
                    sequence: [
                        {
                            func: "{topRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.helpers.verifyStringContent",
                            event:    "{topRequest}.events.onComplete",
                            args:     ["{topRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.top"]
                        }
                    ]
                },
                {
                    name: "Testing first (middle) level of nesting...",
                    type: "test",
                    sequence: [
                        {
                            func: "{middleRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.helpers.verifyStringContent",
                            event:    "{middleRequest}.events.onComplete",
                            args:     ["{middleRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.middle"]
                        }
                    ]
                },
                {
                    name: "Testing deepest (bottom) level of nesting...",
                    type: "test",
                    sequence: [
                        {
                            func: "{bottomRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.helpers.verifyStringContent",
                            event:    "{bottomRequest}.events.onComplete",
                            args:     ["{bottomRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.bottom"]
                        }
                    ]
                }
            ]
        }
    ],
    expected: {
        top:    "You are at the top.",
        middle: "You are in the middle.",
        bottom: "You are on the bottom."
    },
    components: {
        topRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "top"
            }
        },
        middleRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "top/middle"
            }
        },
        bottomRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "top/middle/bottom"
            }
        }
    }
});
