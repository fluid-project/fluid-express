"use strict";

// The base classes we are testing
require("../../../index.js");

// Our test fixtures and test cases
require("./middleware-caseholder");
require("./test-middleware-counter");

// We borrow a router from the router tests to help in testing middleware isolation
require("../router/test-router-hello");
require("../router/test-router-reqview");
require("./test-router-cookiesetter");

// We use just the request-handling bits of the kettle stack in our tests, but we include the whole thing to pick up the base grades
require("../../../node_modules/kettle");
require("../../../node_modules/kettle/lib/test/KettleTestUtils");
