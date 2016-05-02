/* Tests for the "middleware" grade and "wrapper" modules for common Express middleware. */
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes");
require("../lib");

require("./middleware-caseholder");

fluid.defaults("gpii.tests.express.middleware.testEnvironment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:   7531,
    components: {
        express: {
            options: {
                components: {
                    counter: {
                        type: "gpii.test.express.middleware.counter"
                    },
                    cookieSetter: {
                        type: "gpii.test.express.middleware.cookie",
                        options: {
                            priority:  "after:counter"
                        }
                    },
                    hello: {
                        type: "gpii.express.router",
                        options: {
                            path:      "/hello",
                            priority:  "after:cookieSetter",
                            components: {
                                nestedReqView: {
                                    type: "gpii.express.router",
                                    options: {
                                        priority: "before:world",
                                        path: "/rv",
                                        components: {
                                            reqviewChild: {
                                                type: "gpii.express.router",
                                                options: {
                                                    path:    "/jailed",
                                                    components: {
                                                        cookieparser: {
                                                            type: "gpii.express.middleware.cookieparser"
                                                        },
                                                        hello: {
                                                            type: "gpii.test.express.middleware.hello",
                                                            options: {
                                                                message: "This is provided by a module nested four levels deep.",
                                                                priority: "after:cookieparser"
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            reqView: {
                                                type: "gpii.test.express.middleware.reqview",
                                                options: {
                                                    priority: "after:reqviewChild"
                                                }
                                            }
                                        }
                                    }
                                },
                                hello: {
                                    type:     "gpii.test.express.middleware.hello",
                                    priority: "last"
                                },
                                world: {
                                    type: "gpii.express.router",
                                    options: {
                                        path: "/world",
                                        components: {
                                            session: {
                                                type: "gpii.express.middleware.session",
                                                options: {
                                                    priority: "before:world",
                                                    sessionOptions: {
                                                        secret: "Printer, printer take a hint-ter."
                                                    }
                                                }
                                            },
                                            world: {
                                                type: "gpii.test.express.middleware.hello",
                                                options: {
                                                    message: "Hello, yourself"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    reqViewRouter: {
                        type: "gpii.express.router",
                        options: {
                            path: "/reqview",
                            components: {
                                json: {
                                    type: "gpii.express.middleware.bodyparser.json"
                                },
                                urlencoded: {
                                    type: "gpii.express.middleware.bodyparser.urlencoded",
                                    options: {
                                        priority: "after:json"
                                    }
                                },
                                cookieparser: {
                                    type: "gpii.express.middleware.cookieparser",
                                    options: {
                                        priority: "after:urlencoded"
                                    }
                                },
                                session: {
                                    type: "gpii.express.middleware.session",
                                    options: {
                                        priority: "after:cookieparser",
                                        sessionOptions: {
                                            secret: "Printer, printer take a hint-ter."
                                        }
                                    }
                                },
                                reqView: {
                                    type: "gpii.test.express.middleware.reqview",
                                    options: {
                                        priority: "after:session"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "gpii.tests.express.middleware.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.express.middleware.testEnvironment");
