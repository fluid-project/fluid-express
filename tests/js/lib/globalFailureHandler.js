/* eslint-env node */
/*

    A "global error handler" that can be used to test asynchronous failures.

    Use this by requiring this file and then referring to it in your test sequences, as in:

    ```
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
                            args:     ["gpii.test.notifyGlobalError"]
                        },
                        {
                            // SET FIRE TO SOMETHING AND WALK AWAY
                        },
                        {
                            event:    "{globalErrorHandler}.events.onError",
                            listener: "gpii.test.awaitGlobalError"
                        },
                        {
                            funcName: "kettle.test.popInstrumentedErrors"
                        }
                    ]
                }
            ]
        }
    });
 */
// TODO: Discuss the best place for this to live longer-term.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.defaults("gpii.test.globalErrorHandler", {
    gradeNames: ["fluid.component", "fluid.resolveRootSingle"],
    singleRootType: "gpii.test.globalErrorHandlerHolder",
    events: {
        onError: null
    }
});

var globalErrorHandler = gpii.test.globalErrorHandler();

fluid.registerNamespace("gpii.test.globalErrorHandler");
gpii.test.awaitGlobalError = function (priority, message) {
    jqUnit.assert(message);
};

gpii.test.notifyGlobalError = function () {
    globalErrorHandler.events.onError.fire(fluid.makeArray(arguments));
};
