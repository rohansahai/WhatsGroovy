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
          'pluckedSynth': PluckedSynth
        }

        //http://localhost:8080 local hosting!
        //http://whatsgroovy.herokuapp.com  heroku hosting!
        hostUrl = "http://localhost:8080";

        OrganSynth.loadAllFiles(this.myAudioContext);
        Vibraphone.loadAllFiles(this.myAudioContext);
        PluckedSynth.loadAllFiles(this.myAudioContext);
        WildSynth.loadAllFiles(this.myAudioContext);
        //this.playKick();
    };

    AudioApp.prototype.playCurrentInstrument = function(freq, row, instrument, user) {
      var that = this;
      switch (instrument) {
        case 'keys':
          if (!this.organAudioHash[user]){
            this.organAudioHash[user] = this.assignAudioHash('organ');
          }
          this.playInstrument(user, row, this.organAudioHash);
          break;
        case 'triangleWah':
          if (!this.triangleWahs[user] || this.triangleWahs[user].playing === false){
            this.triangleWahs[user] = new TriangleWah(this.myAudioContext);
            this.playApiInstrument(this.triangleWahs[user], user, freq);
          } else {
            this.triangleWahs[user].updateFrequency(freq);
          }
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
        case 'keys':
          this.stopWavInstrument(user, row, this.organAudioHash);
          break;
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

    AudioApp.prototype.playApiInstrument = function(inst, user, freq){
      inst.playing = true;
      inst.frequency = freq;
      inst.playSound();
      this.intervals[user] = setInterval(function(){
        inst.playSound();
      }, 125);
    }

    AudioApp.prototype.playExternalApiInstrument = function(inst, user, row, interval){
      var that = this;
      inst.frequency = row;
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

    AudioApp.prototype.playInstrument = function(user, row, instHash) {
      instHash[user][row].currentTime = 0;

      instHash[user][row].play();
    }

    AudioApp.prototype.stopWavInstrument = function(user, row, instHash){
      instHash[user][row].pause();
    }

    AudioApp.prototype.assignAudioHash = function(folder) {
      var audioHash = {}

      var audioElement1 = document.createElement('audio');
      //audioElement1.setAttribute('preload', 'auto');
      audioElement1.setAttribute('src', 'audios/'+folder+'/g4.wav');
      audioHash[1] = audioElement1;

      var audioElement2 = document.createElement('audio');
      audioElement2.setAttribute('src', 'audios/'+folder+'/e4.wav');
      audioHash[2] = audioElement2;

      var audioElement3 = document.createElement('audio');
      audioElement3.setAttribute('src', 'audios/'+folder+'/d4.wav');
      audioHash[3] = audioElement3;

      var audioElement4 = document.createElement('audio');
      audioElement4.setAttribute('src', 'audios/'+folder+'/c4.wav');
      audioHash[4] = audioElement4;

      var audioElement5 = document.createElement('audio');
      audioElement5.setAttribute('src', 'audios/'+folder+'/a4.wav');
      audioHash[5] = audioElement5;

      var audioElement6 = document.createElement('audio');
      audioElement6.setAttribute('src', 'audios/'+folder+'/g3.wav');
      audioHash[6] = audioElement6;

      var audioElement7 = document.createElement('audio');
      audioElement7.setAttribute('src', 'audios/'+folder+'/e3.wav');
      audioHash[7] = audioElement7;

      var audioElement8 = document.createElement('audio');
      audioElement8.setAttribute('src', 'audios/'+folder+'/d3.wav');
      audioHash[8] = audioElement8;

      var audioElement9 = document.createElement('audio');
      audioElement9.setAttribute('src', 'audios/'+folder+'/c3.wav');
      audioHash[9] = audioElement9;

      var audioElement10 = document.createElement('audio');
      audioElement10.setAttribute('src', 'audios/'+folder+'/a3.wav');
      audioHash[10] = audioElement10;

      return audioHash;

    }

    AudioApp.prototype.initializeAudioHashes = function() {
      this.organAudioHash = {};
      this.wildSynthAudioHash = {};
      this.gatedEdmAudioHash = {};
      this.triangleWahs = {};
      this.organSynths = {};
      this.vibraphones = {};
      this.pluckedSynths = {};
      this.wildSynths = {};
      this.intervals = {};

      this.organAudioHash[0] = this.assignAudioHash('organ');
      this.wildSynthAudioHash[0] = this.assignAudioHash('wild-synth');
      this.gatedEdmAudioHash[0] = this.assignAudioHash('gated-edm');
    };
});
