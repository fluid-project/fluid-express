/*

    Test cases to confirm the clean separation of routers that use the same path but a different method.

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../lib/test-helpers");

var kettle = require("kettle");
kettle.loadTestingSupport();

fluid.registerNamespace("gpii.tests.express.method.caseHolder");

/*

    Check the current output and the list of "counter" middleware that should have already been hit.
    The list will get longer as we go, but the counts for everything that has been hit so far should remain stable.

 */
gpii.tests.express.method.caseHolder.checkMethodAndCounts = function (body, method, middlewareComponents) {
    jqUnit.assertTrue("The response from the server should match the request method...", body.indexOf(method) !== -1);

    fluid.each(middlewareComponents, function (component) {
        jqUnit.assertEquals("There should only be one request for the '" + component.options.method + "' counter middleware...", 1, component.model.count);
    });
};

fluid.defaults("gpii.tests.express.method.request", {
    gradeNames: ["kettle.test.request.http"],
    path:       "{testEnvironment}.options.baseUrl",
    port:       "{testEnvironment}.options.port"
});

fluid.defaults("gpii.tests.express.method.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder"],
    rawModules: [
        {
            tests: [
                {
                    name: "Testing router and middleware isolation with shared paths and different methods...",
                    type: "test",
                    sequence: [
                        {
                            func: "{getRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.method.caseHolder.checkMethodAndCounts",
                            event: "{getRequest}.events.onComplete",
                            args: ["{arguments}.0", "GET", ["{testEnvironment}.express.get.counter"]] // body, method, middlewareComponents
                        },
                        {
                            func: "{postRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.method.caseHolder.checkMethodAndCounts",
                            event: "{postRequest}.events.onComplete",
                            args: ["{arguments}.0", "POST", ["{testEnvironment}.express.get.counter", "{testEnvironment}.express.post.counter"]] // body, method, middlewareComponents
                        },
                        {
                            func: "{putRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.method.caseHolder.checkMethodAndCounts",
                            event: "{putRequest}.events.onComplete",
                            args: ["{arguments}.0", "PUT", ["{testEnvironment}.express.get.counter", "{testEnvironment}.express.post.counter", "{testEnvironment}.express.put.counter"]] // body, method, middlewareComponents
                        },
                        {
                            func: "{deleteRequest}.send"
                        },
                        {
                            listener: "gpii.tests.express.method.caseHolder.checkMethodAndCounts",
                            event: "{deleteRequest}.events.onComplete",
                            args: ["{arguments}.0", "DELETE", ["{testEnvironment}.express.get.counter", "{testEnvironment}.express.post.counter", "{testEnvironment}.express.put.counter", "{testEnvironment}.express.delete.counter"]] // body, method, middlewareComponents
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        getRequest: {
            type: "gpii.tests.express.method.request",
            options: {
                method: "GET"
            }
        },
        putRequest: {
            type: "gpii.tests.express.method.request",
            options: {
                method: "PUT"
            }
        },
        postRequest: {
            type: "gpii.tests.express.method.request",
            options: {
                method: "POST"
            }
        },
        deleteRequest: {
            type: "gpii.tests.express.method.request",
            options: {
                method: "DELETE"
            }
        }
    }
});
