/*

    Caseholder for nesting of routers.

*/
"use strict";
var fluid  = require("infusion");

require("../includes");

fluid.defaults("fluid.tests.express.router.nesting.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing router nesting...",
            tests: [
                {
                    name: "Testing router nesting (top level request)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{topLevelRequest}.send"
                        },
                        {
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
            type: "fluid.test.express.request",
            options: {
                endpoint: "hello"
            }
        },
        deepRequest: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "hello/world"
            }
        }
    }
});
