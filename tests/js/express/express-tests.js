/*
    Unit tests for "express" itself.  Mainly checks the handling of `options.config.express.viewSource` and other
    implicit wiring built into the grade itself.
*/
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");
var fs     = require("fs");

require("../../../index");

jqUnit.module("Testing built-in options wiring for `gpii.express`...");

fluid.registerNamespace("gpii.express.tests.express");

gpii.express.tests.express.confirmNoViewOptions = function (that) {
    jqUnit.start();
    jqUnit.assertNull("There should be no `views` data...",      that.options.config.express.views);
};

gpii.express.tests.express.viewDirsExist = function (that, dirs) {
    jqUnit.start();
    jqUnit.assertNotUndefined("There should be `views` data...", dirs);
    var dirsArray = fluid.makeArray(dirs);
    fluid.each(dirsArray, function (dir) {
        jqUnit.assertTrue("The view directory '" + dir + "' should exist...", fs.existsSync(dir));
    });
};

fluid.defaults("gpii.express.tests.express.base", {
    gradeNames: ["gpii.express"],
    config: {
        express: {
            port:    7433,
            baseUrl: {
                expander: {
                    funcName: "fluid.stringTemplate",
                    args:     ["http://localhost:%port/", "{that}.options.config.express"]
                }
            }
        }
    }
});

fluid.defaults("gpii.express.tests.express.noViewOptions", {
    gradeNames: ["gpii.express.tests.express.base"],
    listeners: {
        "onStarted.runTests": {
            funcName: "gpii.express.tests.express.confirmNoViewOptions",
            args:     ["{that}"]
        }
    }

});

jqUnit.asyncTest("Confirming that express can be set up with no `viewOptions`...", function () {
    gpii.express.tests.express.noViewOptions();
});

fluid.defaults("gpii.express.tests.express.singleViewSource", {
    gradeNames: ["gpii.express.tests.express.base"],
    config: {
        express: {
            port: 7434,
            views: "%gpii-express/tests/views"
        }
    },
    listeners: {
        "onStarted.checkViewDirs": {
            funcName: "gpii.express.tests.express.viewDirsExist",
            args:     ["{that}", "{that}.views"]
        }
    }
});

jqUnit.asyncTest("Confirming that express can be set up with a single `viewOptions` string...", function () {
    gpii.express.tests.express.singleViewSource();
});


fluid.defaults("gpii.express.tests.express.arrayViewSource", {
    gradeNames: ["gpii.express.tests.express.base"],
    config: {
        express: {
            port: 7435,
            views: ["%gpii-express/tests/views", "%gpii-express/src/js"]
        }
    },
    listeners: {
        "onStarted.checkViewDirs": {
            funcName: "gpii.express.tests.express.viewDirsExist",
            args:     ["{that}", "{that}.views"]
        }
    }
});

jqUnit.asyncTest("Confirming that express can be set up with an array of `viewOptions` strings...", function () {
    gpii.express.tests.express.arrayViewSource();
});