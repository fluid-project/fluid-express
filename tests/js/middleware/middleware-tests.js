/* Tests for the "middleware" grade and "wrapper" modules for common Express middleware. */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Load all of the components to be tested and our test cases
require("../includes");
require("./fixtures/");

// We borrow a router from the router tests to help in testing middleware isolation
require("../router/fixtures/");

require("./middleware-caseholder");

fluid.defaults("gpii.express.tests.middleware.testEnvironment", {
    gradeNames: ["gpii.express.tests.testEnvironment"],
    port:   7531,
    components: {
        express: {
            options: {
                components: {
                    middleware: {
                        type: "gpii.express.tests.middleware.counter"
                    },
                    cookie: {
                        type: "gpii.express.tests.router.cookie"
                    },
                    hello: {
                        type: "gpii.express.tests.router.hello",
                        options: {
                            components: {
                                reqview: {
                                    type: "gpii.express.tests.router.reqview",
                                    options: {
                                        path: "/rv",
                                        components: {
                                            reqviewChild: {
                                                type: "gpii.express.tests.router.hello",
                                                options: {
                                                    path:    "/jailed",
                                                    message: "This is provided by a module nested four levels deep.",
                                                    components: {
                                                        cookieparser: {
                                                            type: "gpii.express.middleware.cookieparser"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                world: {
                                    type: "gpii.express.tests.router.hello",
                                    options: {
                                        components: {
                                            session: {
                                                type: "gpii.express.middleware.session",
                                                options: {
                                                    sessionOptions: {
                                                        secret: "Printer, printer take a hint-ter."
                                                    }
                                                }
                                            }
                                        },
                                        path:    "/world",
                                        message: "Hello, yourself"
                                    }
                                }
                            }
                        }
                    },
                    reqview: {
                        type: "gpii.express.tests.router.reqview",
                        options: {
                            components: {
                                json: {
                                    type: "gpii.express.middleware.bodyparser.json"
                                },
                                urlencoded: {
                                    type: "gpii.express.middleware.bodyparser.urlencoded"
                                },
                                cookieparser: {
                                    type: "gpii.express.middleware.cookieparser"
                                },
                                session: {
                                    type: "gpii.express.middleware.session",
                                    options: {
                                        sessionOptions: {
                                            secret: "Printer, printer take a hint-ter."
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.express.tests.middleware.caseHolder"
        }
    }
});

gpii.express.tests.middleware.testEnvironment();
