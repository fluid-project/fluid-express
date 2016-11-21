/* eslint-env node */
/*

  We provide some "helper" grades to assist other people in test routers and other components that run in conjunction
  with an instance of `gpii.express`.  These tests specifically exercise those test components.

 */
"use strict";
var fluid = require("infusion");

require("../includes.js");
require("./helpers-caseholder");

fluid.defaults("gpii.tests.express.helpers.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:       7030,
    components: {
        express: {
            options: {
                components: {
                    topLevelRouter: {
                        type: "gpii.express.router",
                        options: {
                            path: "/deep",
                            components: {
                                deepRouter: {
                                    type: "gpii.express.router",
                                    options: {
                                        path: "/deeper",
                                        components: {
                                            veryDeepMiddleware: {
                                                type: "gpii.test.express.middleware.hello"
                                            }
                                        }
                                    }
                                },
                                deepMiddleware: {
                                    type: "gpii.test.express.middleware.hello",
                                    options: {
                                        priority: "after:deepRouter"
                                    }
                                }
                            }
                        }
                    },
                    topLevelMiddleware: {
                        type: "gpii.test.express.middleware.hello",
                        options: {
                            priority: "after:topLevelRouter"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.helpers.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.helpers.testEnvironment");
