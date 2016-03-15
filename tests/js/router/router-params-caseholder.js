/*

    Tests for router handling of URL parameters.

*/
"use strict";
var fluid  = require("infusion");

require("../includes");
require("./fixtures");

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.router.params.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing the 'params' router module (top level)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{paramsRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.helpers.verifyStringContent",
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
                            listener: "gpii.express.tests.helpers.verifyJSONContent",
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
            type: "gpii.express.tests.request",
            options: {
                endpoint: "params/fooBar"
            }
        },
        deepParamsRequest: {
            type: "gpii.express.tests.request",
            options: {
                endpoint: "params/fooBar/deep"
            }
        }
    }
});
