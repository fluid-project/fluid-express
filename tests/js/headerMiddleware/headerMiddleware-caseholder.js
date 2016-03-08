/* Tests for the "express" and "router" module */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.express.tests.headerMiddleware.caseHolder");

gpii.express.tests.headerMiddleware.caseHolder.checkHeader = function (message, response, header, expected) {
    var headerContent = response.headers[header.toLowerCase()];
    jqUnit.assertEquals(message, expected, headerContent);
};

fluid.defaults("gpii.express.tests.headerMiddleware.request", {
    gradeNames: ["kettle.test.request.http"],
    method: "GET",
    endpoint: "hello?variable=set",
    path: {
        expander: {
            funcName: "fluid.stringTemplate",
            args:     ["%baseUrl%endpoint", { baseUrl: "{testEnvironment}.options.baseUrl", endpoint: "{that}.options.endpoint"}]
        }
    },
    port: "{testEnvironment}.options.port"
});

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.express.tests.headerMiddleware.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder"],
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
                            listener: "gpii.express.tests.headerMiddleware.caseHolder.checkHeader",
                            event:    "{request}.events.onComplete",
                            args:    ["A top level query variable should be set correctly...", "{request}.nativeResponse", "Top-Level-Query-Variable", "set"] // message, response, header, expected
                        },
                        {
                            func: "gpii.express.tests.headerMiddleware.caseHolder.checkHeader",
                            args:    ["A deep query variable should be set correctly...", "{request}.nativeResponse", "Deep-Query-Variable", "set"] // message, response, header, expected
                        },
                        {
                            func: "gpii.express.tests.headerMiddleware.caseHolder.checkHeader",
                            args:    ["A static template should set a header correctly...", "{request}.nativeResponse", "Static-Template", "static template"] // message, response, header, expected
                        },
                        {
                            func: "gpii.express.tests.headerMiddleware.caseHolder.checkHeader",
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
                            listener: "gpii.express.tests.headerMiddleware.caseHolder.checkHeader",
                            event:    "{requestSansQueryData}.events.onComplete",
                            args:    ["A top level query variable should be set correctly...", "{requestSansQueryData}.nativeResponse", "Top-Level-Query-Variable", "%variable"] // message, response, header, expected
                        },
                        {
                            func: "gpii.express.tests.headerMiddleware.caseHolder.checkHeader",
                            args:    ["A deep query variable should be set correctly...", "{requestSansQueryData}.nativeResponse", "Deep-Query-Variable", "%variable"] // message, response, header, expected
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        request: {
            type: "gpii.express.tests.headerMiddleware.request"
        },
        requestSansQueryData: {
            type: "gpii.express.tests.headerMiddleware.request",
            options: {
                endpoint: "hello"
            }
        }
    }
});
