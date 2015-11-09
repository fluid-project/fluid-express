"use strict";

// The base classes we are testing
var express = require("../../../index.js");
express.loadTestingSupport();

// Our test fixtures and test cases
require("./contentAware-caseholder");

// We use just the request-handling bits of the kettle stack in our tests, but we include the whole thing to pick up the base grades
var kettle = require("kettle");
kettle.loadTestingSupport();
