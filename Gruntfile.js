module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-shell');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
    	tsc: {
    		command: function () {
    			return 'node_modules/ntypescript/bin/tsc';
    		}
    	}
    }
  });
  grunt.registerTask('default', ['shell:tsc']);
}