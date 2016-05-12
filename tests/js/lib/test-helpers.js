/*

    Helpers for use in testing gpii.express and services built on top of it.  These support client-side usage because
    of the `addRequiredSequences` method, which likely needs to be moved to a micro module or into Fluid itself.

    TODO:  Discuss with Antranig.

 */

"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.test.express.helpers");

var jqUnit = jqUnit || require("node-jqunit");

/**
 *
 * Confirm that a response has a body and the expected status.
 *
 * @param response {Object} - The Express response object.
 * @param body {Object} - The response body.
 * @param status {Number} - The expected status code (defaults to `200`).
 */
gpii.test.express.helpers.isSaneResponse = function (response, body, status) {
    status = status ? status : 200;

    jqUnit.assertEquals("The response should have a reasonable status code", status, response.statusCode);
    if (response.statusCode !== status) {
        console.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertNotNull("There should be a body.", body);
};

// Confirm that a response body contains the expected string content.
gpii.test.express.helpers.verifyStringContent = function (response, body, expectedString) {
    jqUnit.assertTrue("The body should match the custom content...", body.indexOf(expectedString) !== -1);
};

// Confirm that a JSON payload is as expected.
gpii.test.express.helpers.verifyJSONContent = function (response, body, expected) {
    var payload = JSON.parse(body);
    jqUnit.assertDeepEq("The payload should be as expected...", expected, payload);
};

gpii.test.express.helpers.assembleUrl = function () {
    fluid.fail("This function has been removed.  You will need to migrate to using fluid.stringTemplate instead.");
};

/**
 *
 * Confirm that a request has the expected value for a particular header.
 *
 * @param message {Object} - The message to use for test output.
 * @param response {Object} - The Express response object to inspect.
 * @param header {String} - The header to inspect.
 * @param expected {String} - The expected value.
 */
gpii.test.express.checkHeader = function (message, response, header, expected) {
    var headerContent = response.headers[header.toLowerCase()];
    jqUnit.assertEquals(message, expected, headerContent);
};

/*
 within the express component

 that.router._router.stack holds the root stack (it's an array)

 each entry is a Layer object.  The first two always come from express.

 within each layer object, the "handle" function contains our tagged data, including handle.that

 If handle.that.router exists, look at that.router.stack and continue the process.

 */

/**
 *
 * Diagram all routes within an express instance.
 *
 * @param expressComponent {Object} A `gpii.express` component.
 * @returns {Object} A JSON Object representing all routes within a `gpii.express` instance.
 *
 */
gpii.test.express.diagramAllRoutes = function (expressComponent) {
    return gpii.test.express.diagramOneLevel(expressComponent, expressComponent.router._router);
};

/**
 *
 * Diagram the routes for a single component.  To preserve the routing order of the stack, each level's children
 * are represented in a `children` Array.
 *
 * @param component {Object} A `gpii.express.middleware` component.
 * @param router {Object} The router instance within the component (if there is one).
 * @returns {Object} A JSON Object representing the routes from this level down as well as the method and path for this level.
 */
gpii.test.express.diagramOneLevel = function (component, router) {
    var thisLevel = fluid.filterKeys(component.options, ["method", "path"]);
    thisLevel.typeName = component.typeName;

    if (router) {
        thisLevel.children = fluid.transform(router.stack, function (layer) {
            // This is a `gpii.express.router` instance
            if (layer.handle && layer.handle.that) {
                return gpii.test.express.diagramOneLevel(layer.handle.that, layer.handle.that.router);
            }
            // This is a `gpii.express.middleware` instance
            else if (layer.route) {
                var wrapper = fluid.filterKeys(layer.route, ["path", "methods"]);
                wrapper.children = fluid.transform(layer.route.stack, function (middlewareLayer) {
                    return gpii.test.express.diagramOneLevel(middlewareLayer.handle.that, middlewareLayer.handle.that.router);
                });
                return wrapper;
            }
            // This is something outside of our scope (i.e. native middleware).
            else {
                return "Native middleware '" + (layer.name || "unknown") + "'";
            }
        });
    }

    return thisLevel;
};

/**
 *
 * Add boilerplate test sequence steps that are required to (for example) safely create all fixtures on startup or
 * safely tear down fixtures after a test is complete.
 *
 * @param rawTests {Object} - The original unmodified tests.
 * @param sequenceStart {Object} - The sequence steps (if any) to insert before each test's sequences.
 * @param sequenceEnd {Object} - The sequence steps (if any) to append after each test's sequences.
 * @returns {Object} - The tests with the required start and end steps wired into all test sequences.
 *
 */
gpii.test.express.helpers.addRequiredSequences = function (rawTests, sequenceStart, sequenceEnd) {
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

// A `caseHolder` that uses `options.rawModules` and the above function to create its modules.  If you want to avoid
// the default `sequenceStart`, extend this grade rather than `gpii.test.express.caseHolder`.
//
fluid.defaults("gpii.test.express.caseHolder.base", {
    gradeNames: ["fluid.test.testCaseHolder"],
    mergePolicy: {
        rawModules:    "noexpand",
        sequenceStart: "noexpand",
        sequenceEnd:   "noexpand"
    },
    moduleSource: {
        funcName: "gpii.test.express.helpers.addRequiredSequences",
        args:     ["{that}.options.rawModules", "{that}.options.sequenceStart", "{that}.options.sequenceEnd"]
    }
});

// Standard initial test sequence steps.
gpii.test.express.standardSequenceStart = [
    { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
        func: "{testEnvironment}.events.constructFixtures.fire"
    },
    {
        listener: "fluid.identity",
        event: "{testEnvironment}.events.onAllReady"
    }
];

// A caseholder for use in testing `gpii-express` or its child components.  Your test environment should:
//
//   1. Have a `constructFixtures` event and wait to construct its test components until `constructFixtures` is fired.
//   2. Have an `onAllReady` event which waits for all of the startup events for its child components.
//
// A reference `testEnvironment` is included below.
//
fluid.defaults("gpii.test.express.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder.base"],
    sequenceStart: gpii.test.express.standardSequenceStart
});


// A test environment with events that match those used in `gpii.test.express.caseHolder`.
//
fluid.defaults("gpii.test.express.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    port:   7777,
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{gpii.test.express.testEnvironment}.options.port"}]
        }
    },
    events: {
        constructFixtures: null,
        onExpressReady: null,
        onAllReady: {
            events: {
                onExpressReady: "onExpressReady"
            }
        }
    },
    components: {
        express: {
            createOnEvent: "constructFixtures",
            type: "gpii.express",
            options: {
                port: "{testEnvironment}.options.port",
                baseUrl: "{testEnvironment}.options.baseUrl",
                events: {
                    onStarted: "{testEnvironment}.events.onExpressReady"
                }
            }
        }
    }
});
