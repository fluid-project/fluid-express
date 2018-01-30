/*

    An [Express.js](http://expressjs.com/) instance represented as a Fluid component.  See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/express.md

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var express  = require("express");

fluid.registerNamespace("gpii.express");

gpii.express.pathForComponent = function (that) {
    var instantiator  = fluid.getInstantiator(that);
    var path          = instantiator.idToPath(that.id);

    return fluid.model.parseEL(path);
};

/**
 *
 * @param that {Object} - The `gpii.express` component itself.
 *
 * Create, configure and start our internal instance of `express`.  Wire up all middleware and routers.
 *
 */
gpii.express.init = function (that) {
    if (!that.options.port) {
        fluid.fail(that.options.messages.missingPort);
    }
    else {
        that.express = express();

        fluid.each(that.options.expressAppOptions, function (value, key) {
            that.express.set(key, value);
        });

        that.router = that.express;

        // Tell the `gpii.express.routable` bits we use to wire in our children.
        that.events.onReadyToWireChildren.fire(that);
    }
};

gpii.express.startServer = function (that) {
    that.server = that.express.listen(that.options.port, function () {
        fluid.log("Express server listening on port " + that.express.get("port"));

        fluid.log("Express started...");
        that.events.onStarted.fire(that.express, that);
    });
};

/**
 *
 * @param that {Object} = The `gpii.express` component itself.
 *
 * Stop our internal instance of `express` when our component is destroyed.
 *
 */
gpii.express.stopServer = function (that) {
    if (that.server) {
        that.server.close(function () {
            fluid.log("Express stopped...");
            that.events.onStopped.fire();
        });
    }
};

/**
 *
 * @param array {Object} - An array of strings.
 * @return {Array} - A new array with all references resolved.  The order of elements is preserved.
 *
 * Resolves package references (e. g. `%package-name/path/within/package/`) in an array of strings, which are presumed
 * to represent filesystem paths.
 *
 */
gpii.express.expandPaths = function (array) {
    return fluid.transform(fluid.makeArray(array), fluid.module.resolvePath);
};

fluid.defaults("gpii.express", {
    gradeNames: ["gpii.express.routable", "gpii.express.expressConfigHolder"],
    messages: {
        missingPort: "Cannot initialize express because you have not supplied a 'port' option."
    },
    path: "/",
    express: null,
    expressAppOptions: {
        "port": "{that}.options.port",
        "json replacer": null,
        "json spaces":   2
    },
    events: {
        onStarted:  null,
        onStopped:  null
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.express.init",
            args:     ["{that}"]
        },
        "onChildrenWired.startServer": {
            funcName: "gpii.express.startServer",
            args:     ["{that}"]
        },
        "onDestroy.stopServer": {
            funcName: "gpii.express.stopServer",
            args:     ["{that}"]
        }
    }
});
