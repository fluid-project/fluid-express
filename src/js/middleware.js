// Base grade for express middleware modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into itself

var fluid     = fluid || require('infusion');
fluid.registerNamespace("gpii.express.middleware");

fluid.defaults("gpii.express.middleware", {
    gradeNames: ["fluid.eventedComponent", "fluid.modelRelayComponent", "autoInit"],
    config: "{gpii.express}.options.config"
});