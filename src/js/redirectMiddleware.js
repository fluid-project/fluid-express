/* eslint-env node */
/*

    Middleware that redirects all incoming requests to `that.options.redirectUrl`.  See the docs for details:

    https://github.com/GPII/gpii-express/blob/master/docs/redirectMiddleware.md

 */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.middleware.redirect");

gpii.express.middleware.redirect.handleRedirect = function (that, request, response) {
    response.redirect(that.options.statusCode, that.options.redirectUrl);
};

fluid.defaults("gpii.express.middleware.redirect", {
    gradeNames: ["gpii.express.middleware"],
    statusCode: 301,
    invokers: {
        middleware: {
            funcName: "gpii.express.middleware.redirect.handleRedirect",
            args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
        }
    }
});
