"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
require("../../index");
gpii.express.loadTestingSupport();

var kettle = require("kettle");
kettle.loadTestingSupport();
