"use strict";
var fluid  = require("infusion");

require("../includes");

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.tests.express.router.static.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder"],
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
                            listener: "gpii.tests.express.helpers.verifyStringContent",
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
                            listener: "gpii.tests.express.helpers.verifyStringContent",
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
                            listener: "gpii.tests.express.helpers.verifyJSONContent",
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
                            listener: "gpii.tests.express.helpers.verifyJSONContent",
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
            type: "gpii.tests.express.request",
            options: {
                endpoint: ""
            }
        },
        staticCustomRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "custom.html"
            }
        },
        staticMultiballPrimaryRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "multiball/primary.json",
                json: true
            }
        },
        staticMultiballSecondaryRequest: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "multiball/secondary.json",
                json: true
            }
        }
    }
});
