"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            src: ["./src/**/*.js", "./tests/**/*.js", "./*.js"]
        },
        jshint: {
            src: ["./src/**/*.js", "./tests/**/*.js", "./*.js"],
            buildScripts: ["Gruntfile.js"],
            options: {
                jshintrc: true
            }
        },
        jsonlint: {
            src: ["src/**/*.json", "tests/**/*.json", "./*.json"]
        }
    });

    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-shell");

    // grunt.loadNpmTasks("gruntify-eslint");
    grunt.loadNpmTasks("grunt-eslint");

    grunt.registerTask("lint", "Apply jshint and jsonlint", ["eslint", "jsonlint"]);
};
