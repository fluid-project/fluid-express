/*

    Leave out required pieces of the puzzle and ensure that the grade complains appropriately.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../../index");

jqUnit.test("Confirm that a failure is reported when no middleware invoker is present...", function () {
    var component = gpii.express.middleware({ middleware: false});
    jqUnit.expectFrameworkDiagnostic("`getMiddlewareFn` should fail if no middleware is present...", component.getMiddlewareFn(), "Your middleware grade must have a `middleware` invoker or member.");
});
