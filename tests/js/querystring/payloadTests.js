/* eslint-env node */
// Common "payload" tests cases, in which the caseHolder's testPayload invoker is called to verify that a payload is roundtripped correctly (encoded and then decoded, transmitted to the server, etc.)
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.express.payloadTests");
gpii.tests.express.payloadTests = {
    name: "Standard decoding/encoding payload tests..",
    tests: [
        {
            "name": "An array should be encoded correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"array": ["foo", 1, 0, true, false, 1.21]}]
            }]
        },
        {
            "name": "An field which consists of an empty array should be encoded correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"emptyArray": []}]
            }]
        },
        {
            "name": "An field which consists of an empty object should be encoded correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"emptyObject": {}}]
            }]
        },
        {
            "name": "`falsy` values should be encoded correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{
                    "zero": 0,
                    "falsy": false,
                    "nully": null
                }]
            }]
        },
        {
            "name": "A string should be encoded correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"string": "here we are now"}]
            }]
        },
        {
            "name": "A number with decimal data should be encoded correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"pi": 3.1415926}]
            }]
        },
        {
            "name": "An integer should be encoded correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"integer": 42}]
            }]
        },
        {
            "name": "A deep structure should be encoded correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{
                    "root": {
                        "rootString": "root string value",
                        "rootNumber": 1,
                        "middle": {
                            "middleString": "middle string value",
                            "middleNumber": 2,
                            "bottom": {
                                "bottomString": "bottom string value",
                                "bottomNumber": 3
                            }
                        }
                    }
                }]
            }]
        },
        {
            "name": "International characters should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{
                    "flipTables": "(╯°□°）╯︵ ┻━┻",
                    "eatGlass": "我能吞下玻璃而不傷身體"
                }]
            }]
        },
        {
            "name": "Double quotes should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"doubleQuotes": "\"lasers\""}]
            }]
        },
        {
            "name": "Single quotes should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"singleQuotes": "'lasers'"}]
            }]
        },
        {
            "name": "Leading equals signs should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"leadingEquals": "=)"}]
            }]
        },
        {
            "name": "Ampersands should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"ampersands": "&so forth"}]
            }]
        },
        {
            "name": "Percent signs should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"percents": "%22 of people like quotation marks"}]
            }]
        },
        {
            "name": "Forward slashes should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"slashes": "this / that"}]
            }]
        },
        {
            "name": "Back slashes should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{"backSlashes": "this \\ that"}]
            }]
        },
        {
            "name": "An empty payload should be handled correctly...",
            "sequence": [{
                "func": "{that}.testPayload",
                "args": [{}]
            }]
        }
    ]
};
