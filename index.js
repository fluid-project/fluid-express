// The main file that is included when you run `require("gpii-express")`.
//
// You can optionally load testing support by assigning a variable to the results of `require` and calling
// `loadTestingSupport`, as in:
//
//      var gpiiExpress = require("gpii-express");
//      gpiiExpress.loadTestingSupport();
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var path = require("path");
var resolve = require("resolve");

/*
    Assuming we are starting in `sub-module/node_modules/gpii-express`, check for the existence of `gpii-express`
    in the directory that contains `sub-module`, i.e. `../../..`.

    Adapted from the new "dedupe" handling in infusion:

    https://github.com/fluid-project/infusion/blob/master/src/module/fluid.js
 */

var parentExpress;
try {
    var upPath = path.resolve(__dirname, "../../..");
    var parentExpressPath = resolve.sync("gpii-express", {
        basedir: upPath
    });
    parentExpress = require(parentExpressPath);
} catch (e) {
    // There will always be an exception if we are at the top level.  We choose to ignore it.
}

if (parentExpress) {
    fluid.log("Resolved gpii-express from path " + __dirname + " to " + parentExpress.baseDir);
    module.exports = parentExpress;
    return;
}
else {
    fluid.registerNamespace("gpii.express");
    fluid.module.register("gpii-express", __dirname, require);

    // `fluid.loadIncludes` seems to force paths relative to infusion.  TODO:  Discuss with Antranig.
    gpii.express.loadIncludes = function (includeFilePaths) {
        var includeFilePathsArray = fluid.makeArray(includeFilePaths);
        fluid.each(includeFilePathsArray, function (includeFilePath) {
            var filesToInclude = require(includeFilePath);
            fluid.each(filesToInclude, function (fileToInclude) {
                require(fileToInclude);
            });
        });
    };

    gpii.express.loadIncludes("./mainIncludes.json");

    // Provide a function to optionally load test support.
    gpii.express.loadTestingSupport = function () {
        gpii.express.loadIncludes("./testIncludes.json");
    };

    gpii.express.baseDir = __dirname;

    module.exports = gpii.express;

    fluid.log("Express at path " + gpii.express.baseDir + " is at top level ");
}

