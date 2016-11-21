/* eslint-env node */
"use strict";
var fluid  = require("infusion");

fluid.defaults("gpii.tests.express.headerMiddleware.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing header setting middleware...",
            tests: [
                {
                    name: "Testing `headerSetter` middleware (with query data)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{request}.send"
                        },
                        {
                            listener: "gpii.test.express.checkHeader",
                            event:    "{request}.events.onComplete",
                            args:    ["A top level query variable should be set correctly...", "{request}.nativeResponse", "Top-Level-Query-Variable", "set"] // message, response, header, expected
                        },
                        {
                            func: "gpii.test.express.checkHeader",
                            args:    ["A deep query variable should be set correctly...", "{request}.nativeResponse", "Deep-Query-Variable", "set"] // message, response, header, expected
                        },
                        {
                            func: "gpii.test.express.checkHeader",
                            args:    ["A static template should set a header correctly...", "{request}.nativeResponse", "Static-Template", "static template"] // message, response, header, expected
                        },
                        {
                            func: "gpii.test.express.checkHeader",
                            args:    ["A rule that uses `literalValue` should set a header correctly...", "{request}.nativeResponse", "Static-Rules", "static rules"] // message, response, header, expected
                        }
                    ]
                },
                {
                    name: "Testing `headerSetter` middleware (sans query data)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{requestSansQueryData}.send"
                        },
                        {
                            listener: "gpii.test.express.checkHeader",
                            event:    "{requestSansQueryData}.events.onComplete",
                            args:    ["A top level query variable should be set correctly...", "{requestSansQueryData}.nativeResponse", "Top-Level-Query-Variable", "%variable"] // message, response, header, expected
                        },
                        {
                            func: "gpii.test.express.checkHeader",
                            args:    ["A deep query variable should be set correctly...", "{requestSansQueryData}.nativeResponse", "Deep-Query-Variable", "%variable"] // message, response, header, expected
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        request: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "hello?variable=set"
            }
        },
        requestSansQueryData: {
            type: "gpii.test.express.request",
            options: {
                endpoint: "hello"
            }
        }
    }
});
