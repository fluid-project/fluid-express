"use strict";

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            src: ["src/**/*.js", "tests/**/*.js"],
            buildScripts: ["Gruntfile.js"],
            options: {
                jshintrc: true
            }
        },
        jsonlint: {
            src: ["src/**/*.json", "tests/**/*.json"]
        },
        shell: {
            options: {
                stdout: true,
                stderr: true,
                failOnError: true
            },
            runVmTests: {
                command: "vagrant ssh -c 'cd /home/vagrant/sync; npm test'"
            }
        }
    });

    grunt.registerTask("run-vm-tests", "Run tests in VM", function () {
        grunt.task.run("shell:runVmTests");
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-gpii");

};
