/*

    Testing express itself and fluid.express.router with dynamic components.

*/
"use strict";
var fluid = require("infusion");

require("../includes");

fluid.defaults("fluid.tests.express.routable.dynamic.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
                            listener: "fluid.test.express.helpers.verifyStringContent",
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
            type: "fluid.test.express.request",
            options: {
                endpoint: "a"
            }
        },
        topLevelDynamicRouterRequestB: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "b"
            }
        },
        nestedDynamicRouterRequestA: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "nested/a"
            }
        },
        nestedDynamicRouterRequestB: {
            type: "fluid.test.express.request",
            options: {
                endpoint: "nested/b"
            }
        }
    }
});

fluid.defaults("fluid.tests.express.routable.dynamic.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
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
                        type:    "fluid.test.express.middleware.hello",
                        options: {
                            path:    "{source}.path",
                            message: "{source}.message"
                        }
                    }
                },
                components: {
                    nested: {
                        type: "fluid.express.router",
                        options: {
                            path: "/nested",
                            dynamicComponents: {
                                nestedDynamicRouter: {
                                    sources: "{testEnvironment}.options.dynamicSourceDefs",
                                    type:    "fluid.test.express.middleware.hello",
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
            type: "fluid.tests.express.routable.dynamic.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.routable.dynamic.testEnvironment");
