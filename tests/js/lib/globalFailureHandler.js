/*

    A "global error handler" that can be used to test asynchronous failures.

    Use this by requiring this file and then referring to it in your test sequences, as in:

    ```
    fluid.require("%fluid-express");
    fluid.express.loadTestingSupport();
    fluid.express.loadGlobalFailureHandler();

    fluid.defaults("my.namespaced.caseholder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: {
            name: "Testing failure modes in parser...",
            tests: [
                {
                    name: "Confirm that bad schemas eventually trigger a failure...",
                    type: "test",
                    sequence: [
                        {
                            funcName: "kettle.test.pushInstrumentedErrors",
                            args:     ["fluid.test.notifyGlobalFailure"]
                        },
                        {
                            // SET FIRE TO SOMETHING AND WALK AWAY
                        },
                        {
                            event:    "{globalFailureHandler}.events.onError",
                            listener: "fluid.test.awaitGlobalFailure"
                        },
                        {
                            funcName: "kettle.test.popInstrumentedErrors"
                        }
                    ]
                }
            ]
        }
    });
    ```

    The default listener just asserts, i.e. the test passes if the event is fired.  If you want to perform more
    specific checks, replace that listener with your own.
 */
// TODO: Discuss the best place for this to live longer-term.
"use strict";
var fluid = require("infusion");
var jqUnit = require("node-jqunit");


fluid.defaults("fluid.test.globalFailureHandler", {
    gradeNames: ["fluid.component", "fluid.resolveRootSingle"],
    singleRootType: "fluid.test.globalFailureHandlerHolder",
    events: {
        onError: null
    }
});


fluid.registerNamespace("fluid.test.globalFailureHandler");
fluid.test.awaitGlobalFailure = function (priority, message) {
    jqUnit.assert(message);
};

fluid.test.notifyGlobalFailure = function () {
    globalFailureHandler.events.onError.fire(fluid.makeArray(arguments));
};

var globalFailureHandler = fluid.test.globalFailureHandler();
