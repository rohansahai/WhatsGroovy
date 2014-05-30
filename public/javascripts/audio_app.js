frequencies = {
  11: 110,
  10: 130.81,
  9: 146.83,
  8: 164.81,
  7: 196,
  6: 220,
  5: 261.63,
  4: 293.66,
  3: 329.63,
  2: 392,
	1: 440
}

panning = {
	'BassSynth': -.1,
	'HarpChord': .7,
	'OrganSynth': .3,
	'PluckedSynth': -.7,
	'TriangleWah': -.5,
	'Marimba': .55,
	'WildSynth': .1
}

instrumentGains = {
	'BassSynth': .4,
	'HarpChord': .8,
	'OrganSynth': 1,
	'PluckedSynth': 1,
	'TriangleWah': 1,
	'Marimba': 1.3,
	'WildSynth': .5,
	'Drums': .5
}

$(function(){
    var AudioApp = window.AudioApp = function() {
        this.initializeAudioHashes();
        this.myAudioContext = new AudioContext();
				
				if (!this.myAudioContext){
					$('.modal-body').html("Sorry, this game isn't supported in your browser :(");
				}
				//what do we do if audio context undefined in browser?

        this.setUpVisualizer();

        this.instruments = {
          'wildSynth': WildSynth,
          'organSynth': OrganSynth,
          'marimba': Marimba,
          'pluckedSynth': PluckedSynth,
          'triangleWah': TriangleWah,
					'bassSynth': BassSynth,
					'harpChord': HarpChord
        }
				
        this.instrumentTempos = {
          'wildSynth': 125,
          'organSynth': 125,
          'marimba': 250,
          'pluckedSynth': 125,
          'triangleWah': 125,
					'bassSynth': 125,
					'harpChord': 125
        }

        this.instrumentObjects = {
          'wildSynth': this.wildSynths,
          'organSynth': this.organSynths,
          'marimba': this.marimbas,
          'pluckedSynth': this.pluckedSynths,
          'triangleWah': this.triangleWahs,
					'bassSynth': this.bassSynths,
					'harpChord': this.harpChords
        }

        //http://localhost:8080 local hosting!
        //http://whatsgroovy.herokuapp.com  heroku hosting!
        hostUrl = window.location.origin;
        this.preLoadFiles();
        this.clicked = {};
    };

    AudioApp.prototype.setUpVisualizer = function(){
      this.analyser = this.myAudioContext.createAnalyser();
      this.analyser.fftSize = 128;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    };

    AudioApp.prototype.playCurrentInstrument = function(row, instrument, user) {
			cursors[user].instrument = instrument;
      this.instrumentObjects[instrument][user] = this.checkInstrument(
        this.instrumentObjects[instrument][user], instrument, user, row);
    }

    AudioApp.prototype.checkInstrument = function(obj, instr, user, row){
			console.log("obj-" + obj);
			if (obj){console.log(obj.playing)}
      if (!obj || obj.playing === false){
        obj = new this.instruments[instr](this.myAudioContext, this.analyser);
        this.playExternalApiInstrument(obj, user, row, this.instrumentTempos[instr]);
      } else {
        obj.updateFrequency(row, this.intervals[user]);
      }
      return obj;
    }

    AudioApp.prototype.stopCurrentInstrument = function(row, fromMove, user, instrument){
      if(!fromMove){
        this.clicked[user] = false;
        this.instrumentObjects[instrument][user].playing = false;
				delete this.instrumentObjects[instrument][user]; //ah!
        clearInterval(this.intervals[user]);
      }
    }

    AudioApp.prototype.playExternalApiInstrument = function(inst, user, row, interval){
      this.clicked[user] = true;
      var that = this;
      inst.frequency = row;
      inst.playSound(row);
      this.intervals[user] = setInterval(function(){
        inst.playSound();
      }, interval);
    }

    AudioApp.prototype.updateAnalyser = function(){
      this.analyser.getByteFrequencyData(this.frequencyData);
    }

    AudioApp.prototype.playKick = function(hostUrl) {
      var that = this;
      KickDrum.loadAllFiles(this.myAudioContext, function(){
        KickDrum.playSound(that.myAudioContext, that.analyser);
        setInterval(function(){
          KickDrum.playSound(that.myAudioContext, that.analyser);
        }, 4000);
      });
    };

    AudioApp.prototype.initializeAudioHashes = function() {
      this.triangleWahs = {};
      this.organSynths = {};
      this.marimbas = {};
      this.pluckedSynths = {};
      this.wildSynths = {};
			this.bassSynths = {};
			this.harpChords = {};
      this.intervals = {};
    };

    AudioApp.prototype.preLoadFiles = function() {
      OrganSynth.loadAllFiles(this.myAudioContext);
      Marimba.loadAllFiles(this.myAudioContext);
      PluckedSynth.loadAllFiles(this.myAudioContext);
      WildSynth.loadAllFiles(this.myAudioContext);
			BassSynth.loadAllFiles(this.myAudioContext);
			HarpChord.loadAllFiles(this.myAudioContext);
      this.playKick();
    }
});
