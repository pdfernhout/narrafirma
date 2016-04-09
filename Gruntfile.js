module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-shell');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      serve: {
        command: function () {
          return 'node NarraFirmaServer.js';
        },
        options: {
          execOptions: {
            cwd: 'server'
          }
        }
      },
      tsc: {
        command: function () {
          return 'node_modules/ntypescript/bin/tsc';
        }
      }
    }
  });
  grunt.registerTask('default', ['shell:tsc','shell:serve']);
}