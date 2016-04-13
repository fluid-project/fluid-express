/*

    Caseholder for nesting of routers.

*/
"use strict";
var fluid  = require("infusion");

require("../includes");

fluid.defaults("gpii.tests.express.router.nesting.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing router nesting (top level request)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{topLevelRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.helpers.verifyStringContent",
                            event: "{topLevelRequest}.events.onComplete",
                            args: ["{topLevelRequest}.nativeResponse", "{arguments}.0", "Hello, World"]
                        }
                    ]
                },
                {
                    name: "Testing router nesting (deep request)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{deepRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.helpers.verifyStringContent",
                            event: "{deepRequest}.events.onComplete",
                            args: ["{deepRequest}.nativeResponse", "{arguments}.0", "Hello, yourself"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        topLevelRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "hello"
            }
        },
        deepRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "hello/world"
            }
        }
    }
});
