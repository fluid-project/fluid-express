/*

    An [Express.js](http://expressjs.com/) instance represented as a Fluid component.  See the documentation for details:

    https://github.com/fluid-project/fluid-express/blob/master/docs/express.md

*/
"use strict";
var fluid = require("infusion");

var express  = require("express");

fluid.registerNamespace("fluid.express");

fluid.express.pathForComponent = function (that) {
    var instantiator  = fluid.getInstantiator(that);
    var path          = instantiator.idToPath(that.id);

    return fluid.model.parseEL(path);
};

/**
 *
 * @param {Object} that - The `fluid.express` component itself.
 *
 * Create, configure and start our internal instance of `express`.  Wire up all middleware and routers.
 *
 */
fluid.express.init = function (that) {
    if (!that.options.port) {
        fluid.fail(that.options.messages.missingPort);
    }
    else {
        that.express = express();

        fluid.each(that.options.expressAppOptions, function (value, key) {
            that.express.set(key, value);
        });

        that.router = that.express;

        // Tell the `fluid.express.routable` bits we use to wire in our children.
        that.events.onReadyToWireChildren.fire(that);
    }
};

fluid.express.startServer = function (that) {
    that.server = that.express.listen(that.options.port, function () {
        fluid.log("Express server listening on port " + that.express.get("port"));

        fluid.log("Express started...");
        that.events.onStarted.fire(that.express, that);
    });
};

/**
 *
 * @param {Object} that - The `fluid.express` component itself.
 *
 * Stop our internal instance of `express` when our component is destroyed.
 *
 */
fluid.express.stopServer = function (that) {
    if (that.server) {
        that.server.close(function () {
            fluid.log("Express stopped...");
            that.events.onStopped.fire();
        });
    }
};

/**
 *
 * @param {Object} array - An array of strings.
 * @return {Array} - A new array with all references resolved.  The order of elements is preserved.
 *
 * Resolves package references (e. g. `%package-name/path/within/package/`) in an array of strings, which are presumed
 * to represent filesystem paths.
 *
 */
fluid.express.expandPaths = function (array) {
    return fluid.transform(fluid.makeArray(array), fluid.module.resolvePath);
};

fluid.defaults("fluid.express", {
    gradeNames: ["fluid.express.routable", "fluid.express.expressConfigHolder"],
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
            funcName: "fluid.express.init",
            args:     ["{that}"]
        },
        "onChildrenWired.startServer": {
            funcName: "fluid.express.startServer",
            args:     ["{that}"]
        },
        "onDestroy.stopServer": {
            funcName: "fluid.express.stopServer",
            args:     ["{that}"]
        }
    }
});
