"use strict";
var fluid = require("infusion");

var kettle = require("kettle");
kettle.loadTestingSupport();

fluid.defaults("gpii.test.express.request", {
    gradeNames: ["kettle.test.request.httpCookie"],
    path: {
        expander: {
            funcName: "fluid.stringTemplate",
            args:     ["%baseUrl%endpoint", { baseUrl: "{testEnvironment}.options.baseUrl", endpoint: "{that}.options.endpoint"}]
        }
    },
    port: "{testEnvironment}.options.port",
    method: "GET"
});