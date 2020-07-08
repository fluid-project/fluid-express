"use strict";
var fluid = require("infusion");

require("../../");
fluid.express.loadTestingSupport();

var kettle = fluid.require("%kettle");
kettle.loadTestingSupport();

require("./lib/");
