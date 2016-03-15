"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../");
gpii.express.loadTestingSupport();

var kettle = require("kettle");
kettle.loadTestingSupport();

require("./lib/test-helpers");
require("./lib/request");
