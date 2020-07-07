/*

    Leave out required pieces of the puzzle and ensure that the express grade complains appropriately.

 */
"use strict";
var fluid = require("infusion");

var jqUnit = require("node-jqunit");

require("../../../index");

jqUnit.test("Confirm that a failure is reported when express is missing required arguments...", function () {
    jqUnit.expectFrameworkDiagnostic("`fluid.express` should report an error if no port is supplied...", fluid.express, "Cannot initialize express because you have not supplied a 'port' option.");
});
