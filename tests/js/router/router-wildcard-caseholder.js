"use strict";
var fluid  = require("infusion");

require("../includes");

fluid.defaults("fluid.tests.express.router.wildcard.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
            type: "fluid.test.express.request",
            options: {
                endpoint: "wildcard/"
            }
        },
        wildcardDeepRequest: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "wildcard/many/levels/deep"
            }
        }
    }
});
