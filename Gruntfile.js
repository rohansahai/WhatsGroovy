module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
			my_target: {
	      files: {
	        'dest/output.min.js': 
					[
					 'public/javascripts/audio_app.js',
					 'public/javascripts/audio_chat.js',
					 'public/javascripts/audio_chat_ui.js',
					 'public/javascripts/canvas.js',
					 'public/javascripts/game.js',
					 'public/javascripts/landing.js',
					 'public/javascripts/instruments/bass_synth.js',
 					 'public/javascripts/instruments/harp_chord.js',
					 'public/javascripts/instruments/kick.js',
					 'public/javascripts/instruments/marimba.js',
					 'public/javascripts/instruments/organ_synth.js',
					 'public/javascripts/instruments/plucked_synth.js',
					 'public/javascripts/instruments/triangle_wah.js',
					 'public/javascripts/instruments/tuna.js',
					 'public/javascripts/instruments/wild_synth.js',
					 'public/javascripts/vendor/AudioContextMonkeyPatch.js',
					 'public/javascripts/vendor/ejs.js',
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