"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            sources: {
                md:    [ "./*.md","./docs/**/*.md"],
                js:    ["./src/**/*.js", "./tests/**/*.js", "./*.js"],
                json:  ["./src/**/*.json", "tests/**/*.json", "./*.json"],
                json5: ["./src/**/*.json5", "tests/**/*.json5", "./*.json5"],
                other: ["./.*"]
            }
        },
        markdownlint: {
            options: {
                config: {
                    // Needed to avoid a literal URL in a code example.
                    "no-bare-urls": false
                }
            }
        }
    });

    grunt.loadNpmTasks("fluid-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);
};
