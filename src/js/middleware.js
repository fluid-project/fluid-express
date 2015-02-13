// Base grade for express middleware modules...
//
// The express module will automatically attempt to wire in anything with this gradeName into itself

var fluid     = fluid || require('infusion');
var namespace = "gpii.express.middleware";
var router    = fluid.registerNamespace(namespace);

fluid.defaults(namespace, {
    gradeNames: ["fluid.eventedComponent", "fluid.modelRelayComponent", "autoInit"],
    config: "{gpii.express}.options.config"
});