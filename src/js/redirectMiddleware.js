/*

    Middleware that redirects all incoming requests to `that.options.redirectUrl`.  See the docs for details:

    https://github.com/fluid-project/fluid-express/blob/master/docs/redirectMiddleware.md

 */
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.express.middleware.redirect");

fluid.express.middleware.redirect.handleRedirect = function (that, request, response) {
    response.redirect(that.options.statusCode, that.options.redirectUrl);
};

fluid.defaults("fluid.express.middleware.redirect", {
    gradeNames: ["fluid.express.middleware"],
    statusCode: 301,
    invokers: {
        middleware: {
            funcName: "fluid.express.middleware.redirect.handleRedirect",
            args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
        }
    }
});
