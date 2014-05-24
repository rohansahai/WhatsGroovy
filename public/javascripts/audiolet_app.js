$(function(){
    var AudioletApp = window.AudioletApp = function() {
        this.audiolet = new Audiolet();
        this.c2Frequency = 65.4064;
        this.scale = new MajorScale();
        this.audiolet.scheduler.setTempo(120);
        this.playKick();
        this.playShaker();

        this.organAudioHash = {};
        this.wildSynthAudioHash = {};
        this.gatedEdmAudioHash = {};

        this.myAudioContext = new webkitAudioContext();

        this.organAudioHash[0] = this.assignAudioHash('organ');
        this.wildSynthAudioHash[0] = this.assignAudioHash('wild-synth');
        this.gatedEdmAudioHash[0] = this.assignAudioHash('gated-edm');

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
        case 'api':
          if (!this.synthPadPlaying || this.synthPadPlaying === false){
            this.synthPad = new SynthPad(this.myAudioContext);
            this.synthPadPlaying = true;
            this.synthPad.frequency = freq;
            this.synthPad.playSound();
            this.synthPadInterval = setInterval(function(){
              console.log('yat');
              that.synthPad.playSound();
            }, 250);

          } else {
            console.log('updating');
            this.synthPad.updateFrequency(freq);
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
        case 'api':
            if (!fromMove){
              console.log('stopping instrument');
              this.synthPad.stopSound();
              this.synthPadPlaying = false;
              clearInterval(this.synthPadInterval);
            }
            break;
      }
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
      console.log('playing instrument');
      console.log(instHash[user][row].currentTime);

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
});
