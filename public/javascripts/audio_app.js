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

        this.analyser = this.myAudioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

        this.instruments = {
          'wildSynth': WildSynth,
          'organSynth': OrganSynth,
          'vibraphone': Vibraphone,
          'pluckedSynth': PluckedSynth,
          'triangleWah': TriangleWah
        }

        //http://localhost:8080 local hosting!
        //http://whatsgroovy.herokuapp.com  heroku hosting!
        hostUrl = "http://localhost:8080";
        this.preLoadFiles();

    };

    AudioApp.prototype.playCurrentInstrument = function(row, instrument, user) {
      var that = this;
      switch (instrument) {
        case 'triangleWah':
          this.triangleWahs[user] = this.checkInstrument(this.triangleWahs[user], instrument, user, row);
          break;
        case 'organSynth':
          this.organSynths[user] = this.checkInstrument(this.organSynths[user], instrument, user, row);
          break;
        case 'vibraphone':
          this.vibraphones[user] = this.checkInstrument(this.vibraphones[user], instrument, user, row);
          break;
        case 'pluckedSynth':
          this.pluckedSynths[user] = this.checkInstrument(this.pluckedSynths[user], instrument, user, row);
          break;
        case 'wildSynth':
          this.wildSynths[user] = this.checkInstrument(this.wildSynths[user], instrument, user, row);
          break;
      }
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

      switch (instrument) {
        case 'triangleWah':
            if (!fromMove){
              this.triangleWahs[user].stopSound();
              this.triangleWahs[user].playing = false;
              clearInterval(this.intervals[user]);
            }
            break;
        case 'organSynth':
            if (!fromMove){
              this.organSynths[user].playing = false;
              clearInterval(this.intervals[user]);
            }
            break;
        case 'vibraphone':
            if (!fromMove){
              this.vibraphones[user].playing = false;
              clearInterval(this.intervals[user]);
            }
            break;
        case 'pluckedSynth':
              if (!fromMove){
                this.pluckedSynths[user].playing = false;
                clearInterval(this.intervals[user]);
              }
              break;
        case 'wildSynth':
              if (!fromMove){
                this.wildSynths[user].playing = false;
                this.wildSynths[user].stopSound();
                clearInterval(this.intervals[user]);
              }
              break;
        }
    }

    AudioApp.prototype.playApiInstrument = function(inst, user, row){
      inst.playing = true;
      inst.frequency = frequencies[row];
      inst.playSound();
      this.intervals[user] = setInterval(function(){
        inst.playSound();
      }, 125);
    }

    AudioApp.prototype.playExternalApiInstrument = function(inst, user, row, interval, internal){
      var that = this;
      if (internal){
        inst.frequency = frequencies[row];
      } else {
        inst.frequency = row;
      }
      inst.playSound();
      this.intervals[user] = setInterval(function(){
        that.updateAnalyser();
        inst.playSound();
      }, interval);
    }

    AudioApp.prototype.updateAnalyser = function(){
      this.analyser.getByteFrequencyData(this.frequencyData);
      console.log(this.frequencyData);
      $('#visualizer').css("height", this.frequencyData[0] + "px");
    }

    AudioApp.prototype.playKick = function(hostUrl) {
      var that = this;
      KickDrum.loadAllFiles(this.myAudioContext, function(){
        KickDrum.playSound(that.myAudioContext);
        setInterval(function(){
          KickDrum.playSound(that.myAudioContext);
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
