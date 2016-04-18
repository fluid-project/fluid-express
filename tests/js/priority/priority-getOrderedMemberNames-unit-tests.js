"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../../");

var jqUnit = require("node-jqunit");

jqUnit.module("Testing `getOrderedNicknames` function...");
jqUnit.test("A list of nicknames should be reordered if it has namespaces and priorities...", function () {
    var nicks = ["beta", "alpha", "charlie"];
    var component = fluid.component({
        components: {
            charlie: {
                type: "fluid.component",
                options: {
                    priority: "after:beta"
                }
            },
            beta: {
                type: "fluid.component"
            },
            alpha: {
                type: "fluid.component",
                options: {
                    priority: "before:beta"
                }
            }
        }
    });

    var output = gpii.express.getOrderedMemberNames(nicks, component);
    jqUnit.assertDeepEq("The nicknames should be in the correct order now...", ["alpha", "beta", "charlie"], output);
});

jqUnit.test("A list of nicknames should remain in the same order if it has no namespaces or priorities...", function () {
    var nicks = ["whiskey", "tango", "foxtrot"];
    var component = fluid.component({
        components: {
            foxtrot: {
                type: "fluid.component"
            },
            tango: {
                type: "fluid.component"
            },
            whiskey: {
                type: "fluid.component"
            }
        }
    });

    var output = gpii.express.getOrderedMemberNames(nicks, component);
    jqUnit.assertDeepEq("The nicknames should remain in the original order...", ["foxtrot", "tango", "whiskey"], output);
});

