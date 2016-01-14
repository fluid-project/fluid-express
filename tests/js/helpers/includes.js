"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
require("../../../index");
gpii.express.loadTestingSupport();

// Our test fixtures and test cases
require("./helpers-caseholder");

// We use just the request-handling bits of the kettle stack in our tests, but we include the whole thing to pick up the base grades
var kettle = require("kettle");
kettle.loadTestingSupport();
