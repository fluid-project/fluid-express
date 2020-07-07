/*

    Helpers for use in testing fluid.express and services built on top of it.  These support client-side usage because
    of the `addRequiredSequences` method, which likely needs to be moved to a micro module or into Fluid itself.

    TODO:  Discuss with Antranig.

 */

"use strict";
var fluid = fluid || require("infusion");

fluid.registerNamespace("fluid.test.express.helpers");

var jqUnit = jqUnit || require("node-jqunit");

/**
 *
 * Confirm that a response has a body and the expected status.
 *
 * @param {Object} response - The Express response object.
 * @param {Object} body - The response body.
 * @param {Number} status - The expected status code (defaults to `200`).
 */
fluid.test.express.helpers.isSaneResponse = function (response, body, status) {
    status = status ? status : 200;

    jqUnit.assertEquals("The response should have a reasonable status code", status, response.statusCode);
    if (response.statusCode !== status) {
        console.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertNotNull("There should be a body.", body);
};

// Confirm that a response body contains the expected string content.
fluid.test.express.helpers.verifyStringContent = function (response, body, expectedString) {
    jqUnit.assertTrue("The body should match the custom content...", body.indexOf(expectedString) !== -1);
};

// Confirm that a JSON payload is as expected.
fluid.test.express.helpers.verifyJSONContent = function (response, body, expected) {
    var payload = JSON.parse(body);
    jqUnit.assertDeepEq("The payload should be as expected...", expected, payload);
};

fluid.test.express.helpers.assembleUrl = function () {
    fluid.fail("This function has been removed.  You will need to migrate to using fluid.stringTemplate instead.");
};

/**
 *
 * Confirm that a request has the expected value for a particular header.
 *
 * @param {Object} message - The message to use for test output.
 * @param {Object} response - The Express response object to inspect.
 * @param {String} header - The header to inspect.
 * @param {String} expected - The expected value.
 */
fluid.test.express.checkHeader = function (message, response, header, expected) {
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
 * @param {Object} expressComponent - A `fluid.express` component.
 * @return {Object} A JSON Object representing all routes within a `fluid.express` instance.
 *
 */
fluid.test.express.diagramAllRoutes = function (expressComponent) {
    return fluid.test.express.diagramOneLevel(expressComponent, expressComponent.router._router);
};

/**
 *
 * Diagram the routes for a single component.  To preserve the routing order of the stack, each level's children
 * are represented in a `children` Array.
 *
 * @param {Object} component - A `fluid.express.middleware` component.
 * @param {Object} router - The router instance within the component (if there is one).
 * @return {Object} A JSON Object representing the routes from this level down as well as the method and path for this level.
 */
fluid.test.express.diagramOneLevel = function (component, router) {
    var thisLevel = fluid.filterKeys(component.options, ["method", "path"]);
    thisLevel.typeName = component.typeName;

    if (router) {
        thisLevel.children = fluid.transform(router.stack, function (layer) {
            // This is a `fluid.express.router` instance
            if (layer.handle && layer.handle.that) {
                return fluid.test.express.diagramOneLevel(layer.handle.that, layer.handle.that.router);
            }
            // This is a `fluid.express.middleware` instance
            else if (layer.route) {
                var wrapper = fluid.filterKeys(layer.route, ["path", "methods"]);
                wrapper.children = fluid.transform(layer.route.stack, function (middlewareLayer) {
                    return fluid.test.express.diagramOneLevel(middlewareLayer.handle.that, middlewareLayer.handle.that.router);
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
 * @param {Object} rawTests - The original unmodified tests.
 * @param {Object} sequenceStart - The sequence steps (if any) to insert before each test's sequences.
 * @param {Object} sequenceEnd - The sequence steps (if any) to append after each test's sequences.
 * @return {Object} - The tests with the required start and end steps wired into all test sequences.
 *
 */
fluid.test.express.helpers.addRequiredSequences = function (rawTests, sequenceStart, sequenceEnd) {
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
// the default `sequenceStart`, extend this grade rather than `fluid.test.express.caseHolder`.
//
fluid.defaults("fluid.test.express.caseHolder.base", {
    gradeNames: ["fluid.test.testCaseHolder"],
    mergePolicy: {
        rawModules:    "noexpand",
        sequenceStart: "noexpand",
        sequenceEnd:   "noexpand"
    },
    moduleSource: {
        funcName: "fluid.test.express.helpers.addRequiredSequences",
        args:     ["{that}.options.rawModules", "{that}.options.sequenceStart", "{that}.options.sequenceEnd"]
    }
});

// Standard initial test sequence steps.
fluid.test.express.standardSequenceStart = [
    { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
        func: "{testEnvironment}.events.constructFixtures.fire"
    },
    {
        listener: "fluid.identity",
        event: "{testEnvironment}.events.onFixturesConstructed"
    }
];

// A caseholder for use in testing `fluid-express` or its child components.  Your test environment should:
//
//   1. Have a `constructFixtures` event and wait to construct its test components until `constructFixtures` is fired.
//   2. Have an `onFixturesConstructed` event which waits for all of the startup events for its child components.
//
// A reference `testEnvironment` is included below.
//
fluid.defaults("fluid.test.express.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder.base"],
    sequenceStart: fluid.test.express.standardSequenceStart
});


// A test environment with events that match those used in `fluid.test.express.caseHolder`.
//
fluid.defaults("fluid.test.express.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    port:   7777,
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{fluid.test.express.testEnvironment}.options.port"}]
        }
    },
    events: {
        constructFixtures: null,
        onExpressReady: null,
        onFixturesConstructed: {
            events: {
                onExpressReady: "onExpressReady"
            }
        }
    },
    components: {
        express: {
            createOnEvent: "constructFixtures",
            type: "fluid.express",
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
