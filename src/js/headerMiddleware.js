/*

    A `fluid.express.middleware` component that sets one or more HTTP headers based on the content of `options.headers`.

    See the documentation for more details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/headerMiddleware.md

 */
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.express.middleware.headerSetter");

/**
 *
 * @param {Object} that - The middleware component itself.
 * @param {Any} err - An optional error to pass along to the next piece of middleware in the chain.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The function to be executed next in the middleware chain.
 *
 * A middleware function that adds one or more headers before launching the next middleware function in the chain.
 *
 */
fluid.express.middleware.headerSetter.addHeaders = function (that, err, req, res, next) {
    fluid.each(that.options.headers, function (headerOptions) {
        var templateData = fluid.model.transformWithRules({ that: that, request: req }, headerOptions.dataRules);
        var fieldValue = fluid.stringTemplate(headerOptions.template, templateData);

        res.setHeader(headerOptions.fieldName, fieldValue);
    });

    // Ensure that the presence (or absence) of an error is correctly conveyed to the next piece of middleware.
    next.apply(null, fluid.makeArray(err));
};


fluid.defaults("fluid.express.middleware.headerSetter.base", {
    mergePolicy: {
        "headers": "nomerge"
    }
});

fluid.defaults("fluid.express.middleware.headerSetter", {
    gradeNames: ["fluid.express.middleware.headerSetter.base", "fluid.express.middleware"],
    invokers: {
        middleware: {
            funcName: "fluid.express.middleware.headerSetter.addHeaders",
            args:     ["{that}", null, "{arguments}.0", "{arguments}.1", "{arguments}.2"] // err, req, res, next
        }
    }

});

fluid.defaults("fluid.express.middleware.headerSetter.error", {
    gradeNames: ["fluid.express.middleware.headerSetter.base", "fluid.express.middleware.error"],
    invokers: {
        middleware: {
            funcName: "fluid.express.middleware.headerSetter.addHeaders",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // err, req, res, next
        }
    }
});
