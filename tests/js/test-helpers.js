// Helpers for use in testing gpii.express and services built on top of it.
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.helpers");

gpii.express.tests.helpers.isSaneResponse = function (jqUnit, response, body, status) {
    status = status ? status : 200;

    jqUnit.assertEquals("The response should have a reasonable status code", status, response.statusCode);
    if (response.statusCode !== status) {
        console.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertNotNull("There should be a body.", body);
};