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

fluid.registerNamespace("gpii.express");
fluid.module.register("gpii-express", __dirname, require);

require("./mainIncludes.js");

// Provide a function to optionally load test support.
gpii.express.loadTestingSupport = function () {
    require("./testIncludes.js");
};

module.exports = gpii.express;
