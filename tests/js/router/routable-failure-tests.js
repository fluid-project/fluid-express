// Simple sanity checks for poorly constructed `routable` grades
"use strict";
var fluid  = require("infusion");

require("../../../");

var jqUnit = require("node-jqunit");

jqUnit.module("Testing failure modes for `routable` grade...");

jqUnit.test("A `routable` without a router should throw an error...", function () {
    fluid.failureEvent.addListener(function () {
        jqUnit.assert("Fluid.fail should be called if we are asked to wire children in before we have a router...");
    }, "jqUnit", "before:fail");

    var routable = fluid.express.routable();
    try {
        routable.events.onReadyToWireChildren.fire();
    }
    catch (e) {
        jqUnit.assert("An exception should have been thrown...");
    }

    fluid.failureEvent.removeListener("jqUnit");
});
