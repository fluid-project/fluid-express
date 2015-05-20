"use strict";

// The base classes we are testing
require("../../../index.js");

// Our test fixtures and test cases
require("./router-caseholder");
require("./test-router-hello");
require("./test-router-params");
require("./test-router-reqview");

// We use just the request-handling bits of the kettle stack in our tests, but we include the whole thing to pick up the base grades
require("../../../node_modules/kettle");
require("../../../node_modules/kettle/lib/test/KettleTestUtils");
