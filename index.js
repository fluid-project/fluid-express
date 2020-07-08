// The main file that is included when you run `require("fluid-express")`.
//
// You can optionally load testing support by assigning a variable to the results of `require` and calling
// `loadTestingSupport`, as in:
//
//      var fluidExpress = require("fluid-express");
//      fluidExpress.loadTestingSupport();
//
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.express");
fluid.module.register("fluid-express", __dirname, require);

require("./mainIncludes.js");

// Provide a function to optionally load test support.
fluid.express.loadTestingSupport = function () {
    require("./testIncludes.js");
};

module.exports = fluid.express;
