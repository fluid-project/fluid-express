/*

    Leave out required pieces of the puzzle and ensure that the express grade complains appropriately.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../../index");

jqUnit.test("Confirm that a failure is reported when express is missing required arguments...", function () {
    jqUnit.expectFrameworkDiagnostic("`gpii.express` should report an error if no port is supplied...", gpii.express, "Cannot initialize express because you have not supplied a 'port' option.");
});
