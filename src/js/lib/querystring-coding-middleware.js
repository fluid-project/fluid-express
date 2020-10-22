/*

    Functions to consistently encode and decode JSON objects that are part of a query string, and components
    that use these functions.  See the documentation for details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/querystring-coding.md

 */
"use strict";
var fluid = require("infusion");

var url = require("url");

fluid.registerNamespace("fluid.express.querystring");

// Middleware to replace the built-in query parser
fluid.registerNamespace("fluid.express.middleware.withJsonQueryParser");

fluid.express.middleware.withJsonQueryParser.middleware = function (request, next) {
    var urlObject = url.parse(request.url);
    request.query = fluid.express.querystring.decode(urlObject.search ? urlObject.search.substring(1) : "");
    next();
};

fluid.defaults("fluid.express.middleware.withJsonQueryParser", {
    gradeNames: ["fluid.express.middleware"],
    namespace: "jsonQueryParser",
    invokers: {
        middleware: {
            funcName: "fluid.express.middleware.withJsonQueryParser.middleware",
            args:     ["{arguments}.0", "{arguments}.2"] // request, response (not used), next
        }
    }
});

// Integrate our parser with `fluid.express`
fluid.defaults("fluid.express.withJsonQueryParser", {
    gradeNames: ["fluid.express"],
    expressAppOptions: {
        "query parser": false
    },
    components: {
        queryParser: {
            type: "fluid.express.middleware.withJsonQueryParser",
            options: {
                priority: "first"
            }
        }
    }
});
