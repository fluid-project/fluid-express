/* Tests for the router grade and the "wrapper" modules for common Express routers.  */
"use strict";
var fluid  = require("infusion");

require("../includes");
require("./fixtures");

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.router.static.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing the 'static' router module (index content)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{staticRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.helpers.verifyStringContent",
                            event: "{staticRequest}.events.onComplete",
                            args: ["{staticRequest}.nativeResponse", "{arguments}.0", "body of the index"]
                        }
                    ]
                },
                {
                    name: "Testing the 'static' router module (custom content)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{staticCustomRequest}.send"
                        },
                        {
                            listener: "gpii.express.tests.helpers.verifyStringContent",
                            event: "{staticCustomRequest}.events.onComplete",
                            args: ["{staticCustomRequest}.nativeResponse", "{arguments}.0", "custom page"]
                        }
                    ]
                },
                {
                    name: "Testing the 'static' router module with multiple content directories (primary directory content)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{staticMultiballPrimaryRequest}.send"
                        },
                        {
                            event:    "{staticMultiballPrimaryRequest}.events.onComplete",
                            listener: "gpii.express.tests.helpers.verifyJSONContent",
                            args: ["{staticMultiballPrimaryRequest}.nativeResponse", "{arguments}.0", { "foo": "primary"}]
                        }
                    ]
                },
                {
                    name: "Testing the 'static' router module with multiple content directories (secondary directory content)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{staticMultiballSecondaryRequest}.send"
                        },
                        {
                            event:    "{staticMultiballSecondaryRequest}.events.onComplete",
                            listener: "gpii.express.tests.helpers.verifyJSONContent",
                            args: ["{staticMultiballSecondaryRequest}.nativeResponse", "{arguments}.0", { "bar": "secondary"}]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        cookieJar: {
            type: "kettle.test.cookieJar"
        },
        staticRequest: {
            type: "gpii.express.tests.request",
            options: {
                endpoint: ""
            }
        },
        staticCustomRequest: {
            type: "gpii.express.tests.request",
            options: {
                endpoint: "custom.html"
            }
        },
        staticMultiballPrimaryRequest: {
            type: "gpii.express.tests.request",
            options: {
                endpoint: "multiball/primary.json",
                json: true
            }
        },
        staticMultiballSecondaryRequest: {
            type: "gpii.express.tests.request",
            options: {
                endpoint: "multiball/secondary.json",
                json: true
            }
        }
    }
});
