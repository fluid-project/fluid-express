"use strict";
require("./router-nesting-tests");
require("./router-params-tests");
require("./router-static-tests");
require("./router-wildcard-tests");

// TODO:  This test causes spurious "assertion outside test context" in other tests if it's run at the same time.  Discuss with Antranig.
//require("./router-static-failure-tests");
