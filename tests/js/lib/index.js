"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./diagramAllRoutes");
require("./request");
require("./test-helpers");
require("./test-middleware-cookiesetter");
require("./test-middleware-counter");
require("./test-middleware-hello");
require("./test-middleware-loopback");
require("./test-middleware-params");
require("./test-middleware-reqview");

fluid.registerNamespace("gpii.express.test");

gpii.express.loadGlobalFailureHandler = function () {
    require("./globalFailureHandler");
};
