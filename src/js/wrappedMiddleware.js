/*

    Base grade for "wrapped" third-party middleware (json, urlencoded, etc.)

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("body-parser",     require, "gpii.express.npm.bodyParser");
fluid.require("cookie-parser",   require, "gpii.express.npm.cookieParser");
fluid.require("express-session", require, "gpii.express.npm.session");

fluid.registerNamespace("gpii.express.middleware.wrappedMiddleware");

gpii.express.middleware.wrappedMiddleware.failCleanlyIfNoMiddleware = function (request, response, next) {
    next("Your wrapped middleware grade is missing a meaningful middlewareImpl option.");
};

gpii.express.middleware.wrappedMiddleware.passToWrappedMiddleware = function (that, request, response, next) {
    that.options.middlewareImpl(request, response, next);
};

fluid.defaults("gpii.express.middleware.wrappedMiddleware", {
    gradeNames: ["gpii.express.middleware"],
    middlewareOptions: {},
    middlewareImpl: gpii.express.middleware.wrappedMiddleware.failCleanlyIfNoMiddleware,
    invokers: {
        "middleware": {
            funcName: "gpii.express.middleware.wrappedMiddleware.passToWrappedMiddleware",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
        }
    }
});

fluid.defaults("gpii.express.middleware.bodyparser.json", {
    gradeNames: ["gpii.express.middleware.wrappedMiddleware"],
    namespace: "json",
    middlewareImpl: "@expand:gpii.express.npm.bodyParser.json({that}.options.middlewareOptions)"
});

fluid.defaults("gpii.express.middleware.bodyparser.urlencoded", {
    gradeNames: ["gpii.express.middleware.wrappedMiddleware"],
    namespace: "urlencoded",
    middlewareOptions: { extended: false },
    middlewareImpl: "@expand:gpii.express.npm.bodyParser.urlencoded({that}.options.middlewareOptions)"
});

fluid.defaults("gpii.express.middleware.cookieparser", {
    gradeNames: ["gpii.express.middleware.wrappedMiddleware"],
    namespace:  "cookieparser",
    middlewareOptions: {
        secret: "Not all that secret, now is it?"
    },
    middlewareImpl: "@expand:gpii.express.npm.cookieParser({that}.options.middlewareOptions.secret, {that}.options.middlewareOptions)"
});

fluid.defaults("gpii.express.middleware.session", {
    gradeNames: ["gpii.express.middleware.wrappedMiddleware"],
    namespace:  "session",
    middlewareOptions: {
        secret: "Not all that secret, now is it?"
    },
    middlewareImpl: "@expand:gpii.express.npm.session({that}.options.middlewareOptions)"
});
