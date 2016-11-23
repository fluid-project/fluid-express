"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../");
gpii.express.loadTestingSupport();

var kettle = fluid.require("%kettle");
kettle.loadTestingSupport();

require("./lib/");
