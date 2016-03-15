/*

    Caseholder for nesting of routers.

*/
"use strict";
var fluid  = require("infusion");

require("../includes");
require("./fixtures");

fluid.defaults("gpii.express.tests.router.nesting.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
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
                            listener: "gpii.express.tests.helpers.verifyStringContent",
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
                            listener: "gpii.express.tests.helpers.verifyStringContent",
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
            type: "gpii.express.tests.request",
            options: {
                endpoint: "hello"
            }
        },
        deepRequest: {
            type: "gpii.express.tests.request",
            options: {
                endpoint: "hello/world"
            }
        }
    }
});
