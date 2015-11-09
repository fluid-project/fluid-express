"use strict";

// The base classes we are testing
require("../../../index.js");

// TODO:  Migrate this to use `loadTestingSupport`.
require("../lib/test-helpers");

// Our test fixtures and test cases
require("./helpers-caseholder");

// We use just the request-handling bits of the kettle stack in our tests, but we include the whole thing to pick up the base grades
var kettle = require("kettle");
kettle.loadTestingSupport();
