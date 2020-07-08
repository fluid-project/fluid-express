/* Tests for the "middleware" grade and "wrapper" modules for common Express middleware. */
"use strict";
var fluid = require("infusion");

// Load all of the components to be tested and our test cases
require("../includes");
require("../lib");

require("./middleware-caseholder");

fluid.defaults("fluid.tests.express.middleware.testEnvironment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:   7531,
    components: {
        express: {
            options: {
                components: {
                    counter: {
                        type: "fluid.test.express.middleware.counter"
                    },
                    cookieSetter: {
                        type: "fluid.test.express.middleware.cookie",
                        options: {
                            priority:  "after:counter"
                        }
                    },
                    hello: {
                        type: "fluid.express.router",
                        options: {
                            path:      "/hello",
                            priority:  "after:cookieSetter",
                            components: {
                                nestedReqView: {
                                    type: "fluid.express.router",
                                    options: {
                                        priority: "before:world",
                                        path: "/rv",
                                        components: {
                                            reqviewChild: {
                                                type: "fluid.express.router",
                                                options: {
                                                    path:    "/jailed",
                                                    components: {
                                                        cookieparser: {
                                                            type: "fluid.express.middleware.cookieparser"
                                                        },
                                                        hello: {
                                                            type: "fluid.test.express.middleware.hello",
                                                            options: {
                                                                message: "This is provided by a module nested four levels deep.",
                                                                priority: "after:cookieparser"
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            reqView: {
                                                type: "fluid.test.express.middleware.reqview",
                                                options: {
                                                    priority: "after:reqviewChild"
                                                }
                                            }
                                        }
                                    }
                                },
                                hello: {
                                    type:     "fluid.test.express.middleware.hello"
                                },
                                world: {
                                    type: "fluid.express.router",
                                    options: {
                                        path: "/world",
                                        components: {
                                            session: {
                                                type: "fluid.express.middleware.session",
                                                options: {
                                                    priority: "before:world",
                                                    sessionOptions: {
                                                        secret: "Printer, printer take a hint-ter."
                                                    }
                                                }
                                            },
                                            world: {
                                                type: "fluid.test.express.middleware.hello",
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
                        type: "fluid.express.router",
                        options: {
                            path: "/reqview",
                            components: {
                                json: {
                                    type: "fluid.express.middleware.bodyparser.json"
                                },
                                urlencoded: {
                                    type: "fluid.express.middleware.bodyparser.urlencoded",
                                    options: {
                                        priority: "after:json"
                                    }
                                },
                                cookieparser: {
                                    type: "fluid.express.middleware.cookieparser",
                                    options: {
                                        priority: "after:urlencoded"
                                    }
                                },
                                session: {
                                    type: "fluid.express.middleware.session",
                                    options: {
                                        priority: "after:cookieparser",
                                        sessionOptions: {
                                            secret: "Printer, printer take a hint-ter."
                                        }
                                    }
                                },
                                reqView: {
                                    type: "fluid.test.express.middleware.reqview",
                                    options: {
                                        priority: "after:session"
                                    }
                                }
                            }
                        }
                    },
                    needle: {
                        type: "fluid.express.router",
                        options: {
                            path: "/needle",
                            components: {
                                json: {
                                    type: "fluid.express.middleware.bodyparser.json",
                                    options: {
                                        priority: "first",
                                        middlewareOptions: {
                                            limit: 16
                                        }
                                    }
                                },
                                urlencoded: {
                                    type: "fluid.express.middleware.bodyparser.urlencoded",
                                    options: {
                                        priority: "after:json",
                                        middlewareOptions: {
                                            limit: 16
                                        }
                                    }
                                },
                                world: {
                                    type: "fluid.test.express.middleware.hello",
                                    options: {
                                        priority: "last",
                                        path:     "/",
                                        method:   "post",
                                        message:  "You passed through the eye of the needle."
                                    }
                                }
                            }
                        }
                    },
                    badlyWrapped: {
                        type: "fluid.express.router",
                        options: {
                            path: "/badlyWrapped",
                            components: {
                                json: {
                                    type: "fluid.express.middleware.wrappedMiddleware",
                                    options: {
                                        priority: "first"
                                    }
                                },
                                world: {
                                    type: "fluid.test.express.middleware.hello",
                                    options: {
                                        priority: "last",
                                        path:     "/",
                                        message:  "Somehow you got here."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.tests.express.middleware.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.express.middleware.testEnvironment");
