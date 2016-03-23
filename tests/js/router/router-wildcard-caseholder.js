/* Tests for the router grade and the "wrapper" modules for common Express routers.  */
"use strict";
var fluid  = require("infusion");

require("../includes");
require("./fixtures");

fluid.defaults("gpii.express.tests.router.wildcard.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing the 'wildcard' router module (index content, top-level request)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{wildcardRootRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.helpers.verifyStringContent",
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
                            listener: "gpii.express.tests.helpers.verifyStringContent",
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
            type: "gpii.express.tests.request",
            options: {
                endpoint: "wildcard/"
            }
        },
        wildcardDeepRequest: {
            type: "gpii.express.tests.request",
            options: {
                endpoint: "wildcard/many/levels/deep"
            }
        }
    }
});
