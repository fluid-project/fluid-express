/*

    Functions to consistently encode and decode JSON objects that are part of a query string, and components
    that use these functions.  See the documentation for details:

    https://github.com/fluid-project/fluid-express/blob/main/docs/querystring-coding.md

 */
"use strict";
var fluid = fluid || require("infusion");

fluid.registerNamespace("fluid.express.querystring");

fluid.express.querystring.encodeTransform = function (value, transformSpec) {
    return fluid.express.querystring.encodeObject(value, transformSpec && transformSpec.avoidStringifying);
};

/**
 *
 * Wrap our encoding function as a transformation function.
 *
 */
fluid.defaults("fluid.express.querystring.encodeTransform", {
    gradeNames: ["fluid.standardTransformFunction"]
});

/* eslint-disable jsdoc/require-returns-check */
/**
 *
 * Encode an object and produce a query string.
 *
 * @param {Object} valueToEncode - The value to encode.
 * @param {Boolean} avoidStringifying - By default, all values are stringified.  Pass a "truthy" value for this parameter to pass raw values.
 * @param {String} parentKey - If we are working with "deep" material, parentKey will represent the path to the value.
 * @return {String} A query string representing the object.
 */
/* eslint-enable jsdoc/require-returns-check */
fluid.express.querystring.encodeObject = function (valueToEncode, avoidStringifying, parentKey) {
    if (typeof valueToEncode === "object" && !Array.isArray(valueToEncode)) {
        var segments = [];
        fluid.each(valueToEncode, function (subValue, subKey) {
            var segmentKey = parentKey ? parentKey + "." + subKey : subKey;
            segments.push(fluid.express.querystring.encodeObject(subValue, avoidStringifying, segmentKey));
        });
        if (segments.length === 0) {
            if (parentKey) {
                return encodeURIComponent(parentKey) + "=" + encodeURIComponent(avoidStringifying ? valueToEncode : JSON.stringify(valueToEncode));
            }
            else {
                return "";
            }
        }
        else {
            return segments.join("&");
        }
    }
    else if (parentKey) {
        return encodeURIComponent(parentKey) + "=" + encodeURIComponent(avoidStringifying ? valueToEncode : JSON.stringify(valueToEncode));
    }
    else {
        fluid.fail("Can only encode objects.");
    }
};

/**
 *
 * Decode a query string and produce a JSON object with its values.
 *
 * @param {String} stringToDecode - The raw query string to decode.
 * @return {Object} An object representing the decoded value.
 */
fluid.express.querystring.decode = function (stringToDecode) {
    if (typeof stringToDecode !== "string") {
        fluid.fail("Can only decode strings.");
    }

    var decodedObject = {};

    if (stringToDecode !== "") {
        var segments = stringToDecode.split("&");
        fluid.each(segments, function (segment) {
            var keyValueSegments = segment.split("=");

            var key      = decodeURIComponent(keyValueSegments[0]);
            var value    = keyValueSegments.length === 2 ? JSON.parse(decodeURIComponent(keyValueSegments[1])) : true;

            fluid.set(decodedObject, key, value);
        });
    }

    return decodedObject;
};

fluid.registerNamespace("fluid.express.dataSource.urlEncodedJson");

/* eslint-disable jsdoc/require-returns-check */
/**
 *
 * A replacement for the built-in `resolveUrl` invoker included with `kettle.dataSource.URL`, that encodes
 * `directModel` as part of the query string.
 *
 * @param {Object} that - The dataSource component itself.
 * @param {String} urlToResolve - The raw URL we will be accessing.
 * @param {Object} directModel - The JSON data to be encoded as the query string portion of the URL.
 * @return {String} The combined URL, including the encoded query data.
 */
/* eslint-enable jsdoc/require-returns-check */
fluid.express.dataSource.urlEncodedJson.resolveUrl = function (that, urlToResolve, directModel) {
    if (urlToResolve.indexOf("?") !== -1) {
        fluid.fail("Cannot work with a URL that already includes query data.");
    }
    else if (directModel) {
        return urlToResolve + "?" + fluid.express.querystring.encodeObject(directModel, that.options.avoidStringifying);
    }
    else {
        return urlToResolve;
    }
};

fluid.defaults("fluid.express.dataSource.urlEncodedJson", {
    gradeNames: ["kettle.dataSource.URL"],
    invokers: {
        resolveUrl: {
            funcName: "fluid.express.dataSource.urlEncodedJson.resolveUrl",
            args:     ["{that}", "{arguments}.0", "{arguments}.2"] // url, termMap (not used), directModel
        }
    }
});

fluid.express.querystring.decodeTransform = fluid.express.querystring.decode;

// Wrap the decode function for use in model transformations.
fluid.defaults("fluid.express.querystring.decodeTransform", {
    gradeNames: ["fluid.standardTransformFunction"]
});
