$(function(){
    var AudioletApp = window.AudioletApp = function() {
        this.audiolet = new Audiolet();
        this.c2Frequency = 65.4064;
        this.scale = new MajorScale();
        this.audiolet.scheduler.setTempo(120);
        //this.playKick();
        //this.playShaker();

        this.initializeAudioHashes();

        this.myAudioContext = new webkitAudioContext();

        //http://localhost:8080 local hosting!
        //http://whatsgroovy.herokuapp.com  heroku hosting!
        hostUrl = "http://whatsgroovy.herokuapp.com";

        OrganSynth.loadAllFiles(this.myAudioContext);
        Vibraphone.loadAllFiles(this.myAudioContext);
        PluckedSynth.loadAllFiles(this.myAudioContext);
        this.playMyKick();
    };

    AudioletApp.prototype.playMyKick = function(hostUrl) {
      var that = this;
      KickDrum.loadAllFiles(this.myAudioContext, function(){
        setInterval(function(){
          KickDrum.playSound(that.myAudioContext);
        }, 500);
      });
    };

    AudioletApp.prototype.playCurrentInstrument = function(freq, row, instrument, user) {
      var that = this;
      switch (instrument) {
        case 'keys':
          if (!this.organAudioHash[user]){
            this.organAudioHash[user] = this.assignAudioHash('organ');
          }
          this.playInstrument(user, row, this.organAudioHash);
          break;
        case 'wildSynth':
          if (!this.wildSynthAudioHash[user]){
            this.wildSynthAudioHash[user] = this.assignAudioHash('wild-synth');
          }
          this.playInstrument(user, row, this.wildSynthAudioHash);
          break;
        case 'gatedEdm':
            if (!this.gatedEdmAudioHash[user]){
              this.gatedEdmAudioHash[user] = this.assignGatedEdmAudioHash('gated-edm');
            }
            this.playInstrument(user, row, this.gatedEdmAudioHash);
            break;
        case 'triangleWah':
          if (!this.triangleWahs[user] || this.triangleWahs[user].playing === false){
            this.triangleWahs[user] = new TriangleWah(this.myAudioContext);
            this.playApiInstrument(this.triangleWahs[user], user, freq);
          } else {
            console.log('updating');
            this.triangleWahs[user].updateFrequency(freq);
          }
          break;
        case 'organSynth':
          if (!this.organSynths[user] || this.organSynths[user].playing === false){
            this.organSynths[user] = new OrganSynth(this.myAudioContext);

            this.playExternalApiInstrument(this.organSynths[user], user, row);
          } else {
            console.log('updating');
            this.organSynths[user].updateFrequency(row);
          }
          break;
        case 'vibraphone':
          if (!this.vibraphones[user] || this.vibraphones[user].playing === false){
            this.vibraphones[user] = new Vibraphone(this.myAudioContext);
            this.playExternalApiInstrument(this.vibraphones[user], user, row);
          } else {
            this.vibraphones[user].updateFrequency(row);
          }
          break;
        case 'pluckedSynth':
          if (!this.pluckedSynths[user] || this.pluckedSynths[user].playing === false){
            this.pluckedSynths[user] = new PluckedSynth(this.myAudioContext);
            this.playExternalApiInstrument(this.pluckedSynths[user], user, row);
          } else {
            this.pluckedSynths[user].updateFrequency(row);
          }
          break;
      }
    }

    AudioletApp.prototype.stopCurrentInstrument = function(row, fromMove, user, instrument){

      switch (instrument) {
        case 'keys':
          this.stopWavInstrument(user, row, this.organAudioHash);
          break;
        case 'wildSynth':
          this.stopWavInstrument(user, row, this.wildSynthAudioHash);
          break;
        case 'gatedEdm':
            this.stopWavInstrument(user, row, this.gatedEdmAudioHash);
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
        }
    }

    AudioletApp.prototype.playApiInstrument = function(inst, user, freq){
      inst.playing = true;
      inst.frequency = freq;
      inst.playSound();
      this.intervals[user] = setInterval(function(){
        inst.playSound();
      }, 125);
    }

    AudioletApp.prototype.playExternalApiInstrument = function(inst, user, row){
      inst.frequency = row;
      inst.playSound();
      this.intervals[user] = setInterval(function(){
        inst.playSound();
      }, 125);
    }

    AudioletApp.prototype.playKick = function() {
        this.kickEvent = this.audiolet.scheduler.play([], 1,
            function() {
                var kick = new Kick(this.audiolet);
                kick.connect(this.audiolet.output);
            }.bind(this)
        );

    }

    AudioletApp.prototype.playShaker = function() {
        // Shaker - four to the floor on the off-beat
        // Scheduled as a poly synth
        var that = this;
         this.audiolet.scheduler.addRelative(0.5, function() {
            that.shakerEvent = this.audiolet.scheduler.play([], 1,
                function() {
                    var shaker = new Shaker(this.audiolet);
                    shaker.connect(this.audiolet.output);
                }.bind(this)
            );
        }.bind(this));
    }

    AudioletApp.prototype.playInstrument = function(user, row, instHash) {
      instHash[user][row].currentTime = 0;

      instHash[user][row].play();
    }

    AudioletApp.prototype.stopWavInstrument = function(user, row, instHash){
      instHash[user][row].pause();
    }

    AudioletApp.prototype.assignAudioHash = function(folder) {
      var audioHash = {}

      var audioElement1 = document.createElement('audio');
      //audioElement1.setAttribute('preload', 'auto');
      audioElement1.setAttribute('src', 'audios/'+folder+'/a3.wav');
      audioHash[1] = audioElement1;

      var audioElement2 = document.createElement('audio');
      audioElement2.setAttribute('src', 'audios/'+folder+'/c3.wav');
      audioHash[2] = audioElement2;

      var audioElement3 = document.createElement('audio');
      audioElement3.setAttribute('src', 'audios/'+folder+'/d3.wav');
      audioHash[3] = audioElement3;

      var audioElement4 = document.createElement('audio');
      audioElement4.setAttribute('src', 'audios/'+folder+'/e3.wav');
      audioHash[4] = audioElement4;

      var audioElement5 = document.createElement('audio');
      audioElement5.setAttribute('src', 'audios/'+folder+'/g3.wav');
      audioHash[5] = audioElement5;

      var audioElement6 = document.createElement('audio');
      audioElement6.setAttribute('src', 'audios/'+folder+'/a4.wav');
      audioHash[6] = audioElement6;

      var audioElement7 = document.createElement('audio');
      audioElement7.setAttribute('src', 'audios/'+folder+'/c4.wav');
      audioHash[7] = audioElement7;

      var audioElement8 = document.createElement('audio');
      audioElement8.setAttribute('src', 'audios/'+folder+'/d4.wav');
      audioHash[8] = audioElement8;

      var audioElement9 = document.createElement('audio');
      audioElement9.setAttribute('src', 'audios/'+folder+'/e4.wav');
      audioHash[9] = audioElement9;

      var audioElement10 = document.createElement('audio');
      audioElement10.setAttribute('src', 'audios/'+folder+'/g4.wav');
      audioHash[10] = audioElement10;

      return audioHash;

    }

    AudioletApp.prototype.initializeAudioHashes = function() {
      this.organAudioHash = {};
      this.wildSynthAudioHash = {};
      this.gatedEdmAudioHash = {};
      this.triangleWahs = {};
      this.organSynths = {};
      this.vibraphones = {};
      this.pluckedSynths = {};
      this.intervals = {};

      this.organAudioHash[0] = this.assignAudioHash('organ');
      this.wildSynthAudioHash[0] = this.assignAudioHash('wild-synth');
      this.gatedEdmAudioHash[0] = this.assignAudioHash('gated-edm');
    };
});
