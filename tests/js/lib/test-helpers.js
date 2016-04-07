/*

    Helpers for use in testing gpii.express and services built on top of it.  These support client-side usage because
    of the `addRequiredSequences` method, which likely needs to be moved to a micro module or into Fluid itself.

    TODO:  Discuss with Antranig.

 */

"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.tests.express.helpers");

var jqUnit = jqUnit || require("node-jqunit");

gpii.tests.express.helpers.isSaneResponse = function (response, body, status) {
    status = status ? status : 200;

    jqUnit.assertEquals("The response should have a reasonable status code", status, response.statusCode);
    if (response.statusCode !== status) {
        console.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertNotNull("There should be a body.", body);
};

// Confirm that a response body contains the expected string content.
gpii.tests.express.helpers.verifyStringContent = function (response, body, expectedString) {

    gpii.tests.express.helpers.isSaneResponse(response, body);

    jqUnit.assertTrue("The body should match the custom content...", body.indexOf(expectedString) !== -1);
};

// Confirm that a JSON payload is as expected.
gpii.tests.express.helpers.verifyJSONContent = function (response, body, expected) {
    gpii.tests.express.helpers.isSaneResponse(response, body);

    var payload = JSON.parse(body);
    jqUnit.assertDeepEq("The payload should be as expected...", expected, payload);
};

gpii.tests.express.helpers.assembleUrl = function () {
    fluid.fail("This function has been removed.  You will need to migrate to using fluid.stringTemplate instead.");
};

gpii.tests.express.helpers.addRequiredSequences = function (rawTests, sequenceStart, sequenceEnd) {
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

// If you want to avoid the defaults, extend this grade rather than `gpii.tests.express.caseHolder`.
//
fluid.defaults("gpii.tests.express.caseHolder.base", {
    gradeNames: ["fluid.test.testCaseHolder"],
    mergePolicy: {
        rawModules:    "noexpand",
        sequenceStart: "noexpand",
        sequenceEnd:   "noexpand"
    },
    moduleSource: {
        funcName: "gpii.tests.express.helpers.addRequiredSequences",
        args:     ["{that}.options.rawModules", "{that}.options.sequenceStart", "{that}.options.sequenceEnd"]
    }
});

// Defaults which are useful in most case where you are testing `gpii-express` or its child components.  Your test
// environment should:
//
//   1. Have a `constructServer` event and wait to construct its test components until `constructServer` is fired.
//   2. Have an `onStarted` event which waits for all of the startup events for its child components.
//
fluid.defaults("gpii.tests.express.caseHolder", {
    gradeNames: ["gpii.tests.express.caseHolder.base"],
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


// A test environment with events that match those used in `gpii.tests.express.caseHolder`.
//
fluid.defaults("gpii.tests.express.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    port:   7777,
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{gpii.tests.express.testEnvironment}.options.port"}]
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
                port: "{testEnvironment}.options.port",
                baseUrl: "{testEnvironment}.options.baseUrl",
                events: {
                    onStarted: "{testEnvironment}.events.onStarted"
                }
            }
        }
    }
});
