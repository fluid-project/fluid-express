"use strict";
// Base grade for a holder that contains express configuration data.  This grade allows you to reuse modules outside of
// express that would otherwise depend on express itself.
//
// See [GPII-1140](http://issues.gpii.net/browse/GPII-1140) for details.
//
var fluid = fluid || require("infusion");
fluid.registerNamespace("gpii.express.expressConfigHolder");
fluid.defaults("gpii.express.expressConfigHolder", {
    gradeNames: ["fluid.littleComponent", "autoInit"],
    config: {}
});