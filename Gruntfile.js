module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
			my_target: {
	      files: {
	        'public/javascripts/output1.min.js': 
					[
					 "public/javascripts/*.js",
					 'public/javascripts/instruments/*.js',
					 'public/javascripts/vendor/*.js',
					 ]
	      }
			}
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};