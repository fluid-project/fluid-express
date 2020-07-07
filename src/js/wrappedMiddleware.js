/*

    Base grade for "wrapped" third-party middleware (json, urlencoded, etc.)

 */
"use strict";
var fluid = require("infusion");

fluid.require("body-parser",     require, "fluid.express.npm.bodyParser");
fluid.require("cookie-parser",   require, "fluid.express.npm.cookieParser");
fluid.require("express-session", require, "fluid.express.npm.session");

fluid.registerNamespace("fluid.express.middleware.wrappedMiddleware");

fluid.express.middleware.wrappedMiddleware.failCleanlyIfNoMiddleware = function (request, response, next) {
    next("Your wrapped middleware grade is missing a meaningful middlewareImpl option.");
};

fluid.express.middleware.wrappedMiddleware.passToWrappedMiddleware = function (that, request, response, next) {
    that.options.middlewareImpl(request, response, next);
};

fluid.defaults("fluid.express.middleware.wrappedMiddleware", {
    gradeNames: ["fluid.express.middleware"],
    middlewareOptions: {},
    middlewareImpl: fluid.express.middleware.wrappedMiddleware.failCleanlyIfNoMiddleware,
    invokers: {
        "middleware": {
            funcName: "fluid.express.middleware.wrappedMiddleware.passToWrappedMiddleware",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
        }
    }
});

fluid.defaults("fluid.express.middleware.bodyparser.json", {
    gradeNames: ["fluid.express.middleware.wrappedMiddleware"],
    namespace: "json",
    middlewareImpl: "@expand:fluid.express.npm.bodyParser.json({that}.options.middlewareOptions)"
});

fluid.defaults("fluid.express.middleware.bodyparser.urlencoded", {
    gradeNames: ["fluid.express.middleware.wrappedMiddleware"],
    namespace: "urlencoded",
    middlewareOptions: { extended: false },
    middlewareImpl: "@expand:fluid.express.npm.bodyParser.urlencoded({that}.options.middlewareOptions)"
});

fluid.defaults("fluid.express.middleware.cookieparser", {
    gradeNames: ["fluid.express.middleware.wrappedMiddleware"],
    namespace:  "cookieparser",
    middlewareOptions: {
        secret: "Not all that secret, now is it?"
    },
    middlewareImpl: "@expand:fluid.express.npm.cookieParser({that}.options.middlewareOptions.secret, {that}.options.middlewareOptions)"
});

fluid.defaults("fluid.express.middleware.session", {
    gradeNames: ["fluid.express.middleware.wrappedMiddleware"],
    namespace:  "session",
    middlewareOptions: {
        secret: "Not all that secret, now is it?"
    },
    middlewareImpl: "@expand:fluid.express.npm.session({that}.options.middlewareOptions)"
});
