/* eslint-env node */
"use strict";
var fluid  = require("infusion");

require("../includes");

fluid.defaults("gpii.tests.express.router.wildcard.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing wildcard router paths...",
            tests: [
                {
                    name: "Testing the 'wildcard' router module (index content, top-level request)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{wildcardRootRequest}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event: "{wildcardRootRequest}.events.onComplete",
                            args: ["{wildcardRootRequest}.nativeResponse", "{arguments}.0", "Hello, wild world."]
                        }
                    ]
                },
                {
                    name: "Testing the 'wildcard' router module (index content, deep request)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{wildcardDeepRequest}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event: "{wildcardDeepRequest}.events.onComplete",
                            args: ["{wildcardDeepRequest}.nativeResponse", "{arguments}.0", "Hello, wild world."]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        wildcardRootRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "wildcard/"
            }
        },
        wildcardDeepRequest: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "wildcard/many/levels/deep"
            }
        }
    }
});
