/*

    Testing express itself and gpii.express.router with dynamic components.

*/
"use strict";
var fluid = require("infusion");

require("../includes");

fluid.defaults("gpii.tests.express.routable.dynamic.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing router wiring for dynamic grades...",
            tests: [
                {
                    name: "Testing top-level dynamic router A...",
                    type: "test",
                    sequence: [
                        {
                            func: "{topLevelDynamicRouterRequestA}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event: "{topLevelDynamicRouterRequestA}.events.onComplete",
                            args: ["{topLevelDynamicRouterRequestA}.nativeResponse", "{arguments}.0", "Alligator"]
                        }
                    ]
                },
                {
                    name: "Testing top-level dynamic router B...",
                    type: "test",
                    sequence: [
                        {
                            func: "{topLevelDynamicRouterRequestB}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event: "{topLevelDynamicRouterRequestB}.events.onComplete",
                            args: ["{topLevelDynamicRouterRequestB}.nativeResponse", "{arguments}.0", "Bear"]
                        }
                    ]
                },
                {
                    name: "Testing nested dynamic router A...",
                    type: "test",
                    sequence: [
                        {
                            func: "{nestedDynamicRouterRequestA}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event: "{nestedDynamicRouterRequestA}.events.onComplete",
                            args: ["{nestedDynamicRouterRequestA}.nativeResponse", "{arguments}.0", "Alligator"]
                        }
                    ]
                },
                {
                    name: "Testing top-level dynamic router B...",
                    type: "test",
                    sequence: [
                        {
                            func: "{nestedDynamicRouterRequestB}.send"
                        },
                        {
                            listener: "gpii.test.express.helpers.verifyStringContent",
                            event: "{nestedDynamicRouterRequestB}.events.onComplete",
                            args: ["{nestedDynamicRouterRequestB}.nativeResponse", "{arguments}.0", "Bear"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        topLevelDynamicRouterRequestA: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "a"
            }
        },
        topLevelDynamicRouterRequestB: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "b"
            }
        },
        nestedDynamicRouterRequestA: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "nested/a"
            }
        },
        nestedDynamicRouterRequestB: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "nested/b"
            }
        }
    }
});

fluid.defaults("gpii.tests.express.routable.dynamic.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    dynamicSourceDefs: [
        { path: "/a", message: "Alligator" },
        { path: "/b", message: "Bear" }
    ],
    components: {
        express: {
            options: {
                dynamicComponents: {
                    topLevelDynamicRouter: {
                        sources: "{testEnvironment}.options.dynamicSourceDefs",
                        type:    "gpii.test.express.middleware.hello",
                        options: {
                            path:    "{source}.path",
                            message: "{source}.message"
                        }
                    }
                },
                components: {
                    nested: {
                        type: "gpii.express.router",
                        options: {
                            path: "/nested",
                            dynamicComponents: {
                                nestedDynamicRouter: {
                                    sources: "{testEnvironment}.options.dynamicSourceDefs",
                                    type:    "gpii.test.express.middleware.hello",
                                    options: {
                                        path:    "{source}.path",
                                        message: "{source}.message"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.express.routable.dynamic.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.routable.dynamic.testEnvironment");
