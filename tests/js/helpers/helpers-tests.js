/*

  We provide some "helper" grades to assist other people in test routers and other components that run in conjunction
  with an instance of `fluid.express`.  These tests specifically exercise those test components.

 */
"use strict";
var fluid = require("infusion");

require("../includes.js");
require("./helpers-caseholder");

fluid.defaults("fluid.tests.express.helpers.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:       7030,
    components: {
        express: {
            options: {
                components: {
                    topLevelRouter: {
                        type: "fluid.express.router",
                        options: {
                            path: "/deep",
                            components: {
                                deepRouter: {
                                    type: "fluid.express.router",
                                    options: {
                                        path: "/deeper",
                                        components: {
                                            veryDeepMiddleware: {
                                                type: "fluid.test.express.middleware.hello"
                                            }
                                        }
                                    }
                                },
                                deepMiddleware: {
                                    type: "fluid.test.express.middleware.hello",
                                    options: {
                                        priority: "after:deepRouter"
                                    }
                                }
                            }
                        }
                    },
                    topLevelMiddleware: {
                        type: "fluid.test.express.middleware.hello",
                        options: {
                            priority: "after:topLevelRouter"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.helpers.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.helpers.testEnvironment");
