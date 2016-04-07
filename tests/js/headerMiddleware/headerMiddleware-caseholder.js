"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.express.headerMiddleware.caseHolder");

gpii.tests.express.headerMiddleware.caseHolder.checkHeader = function (message, response, header, expected) {
    var headerContent = response.headers[header.toLowerCase()];
    jqUnit.assertEquals(message, expected, headerContent);
};

fluid.defaults("gpii.tests.express.headerMiddleware.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing `headerSetter` middleware (with query data)...",
                    type: "test",
                    sequence: [
                        {
                            func: "{request}.send"
                        },
                        {
                            listener: "gpii.tests.express.headerMiddleware.caseHolder.checkHeader",
                            event:    "{request}.events.onComplete",
                            args:    ["A top level query variable should be set correctly...", "{request}.nativeResponse", "Top-Level-Query-Variable", "set"] // message, response, header, expected
                        },
                        {
                            func: "gpii.tests.express.headerMiddleware.caseHolder.checkHeader",
                            args:    ["A deep query variable should be set correctly...", "{request}.nativeResponse", "Deep-Query-Variable", "set"] // message, response, header, expected
                        },
                        {
                            func: "gpii.tests.express.headerMiddleware.caseHolder.checkHeader",
                            args:    ["A static template should set a header correctly...", "{request}.nativeResponse", "Static-Template", "static template"] // message, response, header, expected
                        },
                        {
                            func: "gpii.tests.express.headerMiddleware.caseHolder.checkHeader",
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
                            listener: "gpii.tests.express.headerMiddleware.caseHolder.checkHeader",
                            event:    "{requestSansQueryData}.events.onComplete",
                            args:    ["A top level query variable should be set correctly...", "{requestSansQueryData}.nativeResponse", "Top-Level-Query-Variable", "%variable"] // message, response, header, expected
                        },
                        {
                            func: "gpii.tests.express.headerMiddleware.caseHolder.checkHeader",
                            args:    ["A deep query variable should be set correctly...", "{requestSansQueryData}.nativeResponse", "Deep-Query-Variable", "%variable"] // message, response, header, expected
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        request: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "hello?variable=set"
            }
        },
        requestSansQueryData: {
            type: "gpii.tests.express.request",
            options: {
                endpoint: "hello"
            }
        }
    }
});
