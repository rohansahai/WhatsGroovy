frequencies = {
  10: 110,
  9: 130.81,
  8: 146.83,
  7: 164.81,
  6: 196,
  5: 220,
  4: 261.63,
  3: 293.66,
  2: 329.63,
  1: 392
}

$(function(){
    var AudioApp = window.AudioApp = function() {
        this.initializeAudioHashes();
        this.myAudioContext = new webkitAudioContext();

        this.setUpVisualizer();

        this.instruments = {
          'wildSynth': WildSynth,
          'organSynth': OrganSynth,
          'vibraphone': Vibraphone,
          'pluckedSynth': PluckedSynth,
          'triangleWah': TriangleWah
        }

        this.instrumentObjects = {
          'wildSynth': this.wildSynths,
          'organSynth': this.organSynths,
          'vibraphone': this.vibraphones,
          'pluckedSynth': this.pluckedSynths,
          'triangleWah': this.triangleWahs
        }

        //http://localhost:8080 local hosting!
        //http://whatsgroovy.herokuapp.com  heroku hosting!
        hostUrl = "http://whatsgroovy.herokuapp.com";
        this.preLoadFiles();
        this.clicked = {};
    };

    AudioApp.prototype.setUpVisualizer = function(){
      this.analyser = this.myAudioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    };

    AudioApp.prototype.playCurrentInstrument = function(row, instrument, user) {
      this.instrumentObjects[instrument][user] = this.checkInstrument(
        this.instrumentObjects[instrument][user], instrument, user, row);
    }

    AudioApp.prototype.checkInstrument = function(obj, instr, user, row){
      if (!obj || obj.playing === false){
        obj = new this.instruments[instr](this.myAudioContext, this.analyser);
        this.playExternalApiInstrument(obj, user, row, 125);
      } else {
        obj.updateFrequency(row, this.intervals[user]);
      }
      return obj;
    }

    AudioApp.prototype.stopCurrentInstrument = function(row, fromMove, user, instrument){
      if(!fromMove){
        this.clicked[user] = false;
        this.instrumentObjects[instrument][user].playing = false;
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
      this.vibraphones = {};
      this.pluckedSynths = {};
      this.wildSynths = {};
      this.intervals = {};
    };

    AudioApp.prototype.preLoadFiles = function() {
      OrganSynth.loadAllFiles(this.myAudioContext);
      Vibraphone.loadAllFiles(this.myAudioContext);
      PluckedSynth.loadAllFiles(this.myAudioContext);
      WildSynth.loadAllFiles(this.myAudioContext);
      this.playKick();
    }
});
