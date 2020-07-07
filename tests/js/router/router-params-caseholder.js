/*

    Tests for router handling of URL parameters.

*/
"use strict";
var fluid  = require("infusion");

require("../includes");

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("fluid.tests.express.router.params.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing URL parameters in router paths...",
            tests: [
                {
                    name: "Testing the 'params' router module (top level)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{paramsRequest}.send"
                        },
                        {
                            listener: "fluid.test.express.helpers.verifyStringContent",
                            event:    "{paramsRequest}.events.onComplete",
                            args:     ["{paramsRequest}.nativeResponse", "{arguments}.0", "fooBar"]
                        }
                    ]
                },
                {
                    name: "Testing the 'params' router module (deep)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{deepParamsRequest}.send"
                        },
                        {
                            listener: "fluid.test.express.helpers.verifyJSONContent",
                            event:    "{deepParamsRequest}.events.onComplete",
                            args:     ["{deepParamsRequest}.nativeResponse", "{arguments}.0", { ok: true, params: { myVar: "fooBar"}}]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        paramsRequest: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "params/fooBar"
            }
        },
        deepParamsRequest: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "params/fooBar/deep"
            }
        }
    }
});
