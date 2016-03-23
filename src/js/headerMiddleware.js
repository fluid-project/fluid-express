/*

    A `gpii.express.middleware` component that sets one or more HTTP headers based on the content of `options.headers`.

    See the documentation for more details:

    https://github.com/GPII/gpii-express/blob/master/docs/headerMiddleware.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.middleware.headerSetter");

/**
 *
 * @param that {Object} The middleware component itself.
 * @param req {Object} The Express request object.
 * @param res {Object} The Express response object.
 * @param next {Function} The function to be executed next in the middleware chain.
 *
 * A middleware function that adds one or more headers before launching the next middleware function in the chain.
 *
 */
gpii.express.middleware.headerSetter.addHeaders = function (that, req, res, next) {
    fluid.each(that.options.headers, function (headerOptions) {
        var templateData = fluid.model.transformWithRules({ that: that, request: req }, headerOptions.dataRules);
        var fieldValue = fluid.stringTemplate(headerOptions.template, templateData);

        res.setHeader(headerOptions.fieldName, fieldValue);
    });

    next();
};


fluid.defaults("gpii.express.middleware.headerSetter", {
    gradeNames: ["gpii.express.middleware"],
    mergePolicy: {
        "headers": "nomerge"
    },
    invokers: {
        middleware: {
            funcName: "gpii.express.middleware.headerSetter.addHeaders",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // req, res, next
        }
    }

});