/*

  Test the convenience caseholder we provide.  Wiring in sequence steps at the start of the sequence is well exercised
  by other tests in this package, these tests focus more on steps appended to the end of test sequences and on
  confirming that everything works end-to-end.

 */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

require("../../../");
gpii.express.loadTestingSupport();

fluid.registerNamespace("gpii.tests.express.helpers");
gpii.tests.express.helpers.checkRoutingDiagram = function (expressInstance, expectedOutput) {
    var output = gpii.test.express.diagramAllRoutes(expressInstance);

    jqUnit.assertLeftHand("The routing diagram should be as expected...", expectedOutput, output);
};

// Wire in an instance of kettle.requests.request.http for each test and wire the check to its onError or onSuccess event
fluid.defaults("gpii.tests.express.helpers.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder.base"],
    expected: {
        routerDiagram: {
            children: [
                "Native middleware 'query'",
                "Native middleware 'expressInit'",
                {
                    children: [
                        {
                            children: [
                                {
                                    children: [{
                                        method:   "get",
                                        path:     "/",
                                        typeName: "gpii.test.express.middleware.hello"
                                    }],
                                    methods: { get: true},
                                    path: "/"
                                }
                            ],
                            method: "use",
                            path: "/deeper",
                            typeName: "gpii.express.router"
                        },
                        {
                            children: [{
                                method: "get",
                                path:   "/",
                                typeName: "gpii.test.express.middleware.hello"
                            }],
                            methods: { get: true},
                            path: "/"
                        }
                    ],
                    method: "use",
                    path: "/deep",
                    typeName: "gpii.express.router"
                },
                {
                    children: [{
                        method: "get",
                        path:   "/",
                        typeName: "gpii.test.express.middleware.hello"
                    }],
                    methods: {
                        get: true
                    },
                    path: "/"
                }
            ],
            path: "/"
        }
    },
    sequenceStart: [
        // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
        {
            func: "{testEnvironment}.events.constructFixtures.fire"
        },
        {
            listener: "fluid.identity",
            event: "{testEnvironment}.events.onStarted"
        },
        {
            func: "jqUnit.assert",
            args: ["Reached end of sequenceStart content added by addRequiredSequence..."]
        }
    ],
    sequenceEnd: [
        {
            func: "jqUnit.assert",
            args: ["Reached end of sequenceEnd content added by addRequiredSequence..."]
        }
    ],
    rawModules: [
        {
            name: "Testing test helpers...",
            tests: [
                {
                    name:     "The test helpers should work end-to-end the first time...",
                    expect:   2,
                    type:     "test",
                    sequence: []
                },
                {
                    name:     "The test helpers should work end-to-end a second time...",
                    type:     "test",
                    expect:   2,
                    sequence: []
                },
                {
                    name: "We should be able to correctly diagram the routes within our instance...",
                    type: "test",
                    sequence: [{
                        func: "gpii.tests.express.helpers.checkRoutingDiagram",
                        args: ["{testEnvironment}.express", "{that}.options.expected.routerDiagram"]
                    }]
                }
            ]
        }
    ]
});
