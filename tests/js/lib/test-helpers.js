/*

    Helpers for use in testing gpii.express and services built on top of it.  These support client-side usage because
    of the `addRequiredSequences` method, which likely needs to be moved to a micro module or into Fluid itself.

    TODO:  Discuss with Antranig.

 */

"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.tests.helpers");

var jqUnit = jqUnit || require("node-jqunit");

gpii.express.tests.helpers.isSaneResponse = function (response, body, status) {
    status = status ? status : 200;

    jqUnit.assertEquals("The response should have a reasonable status code", status, response.statusCode);
    if (response.statusCode !== status) {
        console.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertNotNull("There should be a body.", body);
};

// Confirm that a response body contains the expected string content.
gpii.express.tests.helpers.verifyStringContent = function (response, body, expectedString) {

    gpii.express.tests.helpers.isSaneResponse(response, body);

    jqUnit.assertTrue("The body should match the custom content...", body.indexOf(expectedString) !== -1);
};

// Confirm that a JSON payload is as expected.
gpii.express.tests.helpers.verifyJSONContent = function (response, body, expected) {
    gpii.express.tests.helpers.isSaneResponse(response, body);

    var payload = JSON.parse(body);
    jqUnit.assertDeepEq("The payload should be as expected...", expected, payload);
};

gpii.express.tests.helpers.assembleUrl = function () {
    fluid.fail("This function has been removed.  You will need to migrate to using fluid.stringTemplate instead.");
};

gpii.express.tests.helpers.addRequiredSequences = function (rawTests, sequenceStart, sequenceEnd) {
    var completeTests = fluid.copy(rawTests);

    for (var a = 0; a < completeTests.length; a++) {
        var testSuite = completeTests[a];
        for (var b = 0; b < testSuite.tests.length; b++) {
            var tests = testSuite.tests[b];
            var modifiedSequence = tests.sequence;
            if (sequenceStart) {
                modifiedSequence = sequenceStart.concat(tests.sequence);
            }
            if (sequenceEnd) {
                modifiedSequence = modifiedSequence.concat(sequenceEnd);
            }
            tests.sequence = modifiedSequence;
        }
    }

    return completeTests;
};

// If you want to avoid the defaults, extend this grade rather than `gpii.express.tests.caseHolder`.
//
fluid.defaults("gpii.express.tests.caseHolder.base", {
    gradeNames: ["fluid.test.testCaseHolder"],
    mergePolicy: {
        rawModules:    "noexpand",
        sequenceStart: "noexpand",
        sequenceEnd:   "noexpand"
    },
    moduleSource: {
        funcName: "gpii.express.tests.helpers.addRequiredSequences",
        args:     ["{that}.options.rawModules", "{that}.options.sequenceStart", "{that}.options.sequenceEnd"]
    }
});

// Defaults which are useful in most case where you are testing `gpii-express` or its child components.  Your test
// environment should:
//
//   1. Have a `constructServer` event and wait to construct its test components until `constructServer` is fired.
//   2. Have an `onStarted` event which waits for all of the startup events for its child components.
//
fluid.defaults("gpii.express.tests.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder.base"],
    sequenceStart: [
        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
            func: "{testEnvironment}.events.constructServer.fire"
        },
        {
            listener: "fluid.identity",
            event: "{testEnvironment}.events.onStarted"
        }
    ]
});


// A test environment with events that match those used in `gpii.express.tests.caseHolder`.
//
fluid.defaults("gpii.express.tests.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    port:   7777,
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{gpii.express.tests.testEnvironment}.options.port"}]
        }
    },
    events: {
        constructServer: null,
        onStarted: null
    },
    components: {
        express: {
            createOnEvent: "constructServer",
            type: "gpii.express",
            options: {
                events: {
                    onStarted: "{testEnvironment}.events.onStarted"
                },
                config: {
                    express: {
                        port: "{testEnvironment}.options.port",
                        baseUrl: "{testEnvironment}.options.baseUrl"
                    }
                }
            }
        }
    }
});
