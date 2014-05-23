$(function(){
    var AudioletApp = window.AudioletApp = function() {
        this.audiolet = new Audiolet();
        this.c2Frequency = 65.4064;
        this.scale = new MajorScale();
        this.audiolet.scheduler.setTempo(120);
        this.playKick();
        //this.playBassSynth();
        this.playShaker();
        //this.playOrgan();
        this.highSynthFreqs = {};
        this.highSynthEvents = {};
        this.bassSynthFreqs = {};
        this.bassSynthEvents = {};

        this.organAudioHash = {};
        this.wildSynthAudioHash = {};
        this.gatedEdmAudioHash = {};

        this.organAudioHash[0] = this.assignAudioHash('organ');
        this.wildSynthAudioHash[0] = this.assignAudioHash('wild-synth');
        this.gatedEdmAudioHash[0] = this.assignAudioHash('gated-edm');

    };

    AudioletApp.prototype.playCurrentInstrument = function(freq, row, instrument, user) {
      switch (instrument) {
        case 'high synth':
          this.highSynthFreqs[user] = freq;
          if (!this.highSynthEvents[user]){ this.playHighSynth(user);}
          break;
        case 'bassSynth':
          this.bassSynthFreqs[user] = freq;
          if (!this.bassSynthEvents[user]){ this.playBassSynth(user);}
          break;
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
      }
    }

    AudioletApp.prototype.stopCurrentInstrument = function(event, row, fromMove, user, instrument){

      switch (instrument) {
        case 'high synth':
          if (!fromMove){
            console.log('stopping instrument');
            this.stopInstrument(this.highSynthEvents[user]);
            this.highSynthEvents[user] = undefined;
          }
          break;
        case 'bassSynth':
          if (!fromMove){
            console.log('stopping instrument');
            this.stopInstrument(this.bassSynthEvents[user]);
            this.bassSynthEvents[user] = undefined;
          }
          break;
        case 'keys':
          this.stopWavInstrument(user, row, this.organAudioHash);
          break;
        case 'wildSynth':
          this.stopWavInstrument(user, row, this.wildSynthAudioHash);
          break;
        case 'gatedEdm':
            this.stopWavInstrument(user, row, this.gatedEdmAudioHash);
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

    AudioletApp.prototype.stopInstrument = function(event) {
      this.audiolet.scheduler.stop(event);
    }

    AudioletApp.prototype.playHighSynth = function(user) {
        // High synth - scheduled as a mono synth (i.e. one instance keeps
        // running and the gate and frequency are switched)
        this.highSynth = new HighSynth(this.audiolet);

        // Connect it to the output so we can hear it
        this.highSynth.connect(this.audiolet.output);

        // Four rising arpeggios starting at sucessively higher notes
        var arp1 = new PArithmetic(0, 1, 4);
        var arp2 = new PArithmetic(1, 1, 4);
        var arp3 = new PArithmetic(2, 1, 4);
        var arp4 = new PArithmetic(3, 1, 4);

        // Plays the arpeggios one after another, then repeat them
        var degreePattern = new PSequence([arp1],
                                          Infinity);

        // How long each event lasts
        var durationPattern = new PSequence([0.5], Infinity);

        // Schedule the patterns to play
        this.highSynthEvents[user] = this.audiolet.scheduler.play([], .5,
            function() {
                // Set the gate
                this.highSynth.trigger.trigger.setValue(1);
                // Calculate the frequency from the scale
                // Set the frequency
                this.highSynth.sine.frequency.setValue(this.highSynthFreqs[user]);
            }.bind(this)
        );
    }

    AudioletApp.prototype.playBassSynth = function(user) {
        // Bass synth - scheduled as a mono synth (i.e. one instance keeps
        // running and the gate and frequency are switched)
        this.bassSynth = new BassSynth(this.audiolet);

        // Connect it to the output so we can hear it
        this.bassSynth.connect(this.audiolet.output);

        // Bassline
        this.bassSynthEvents[user] = this.audiolet.scheduler.play([], .5,
            function() {
                // Set the gate
                this.bassSynth.trigger.trigger.setValue(1);
                // Calculate the frequency from the scale
                // Set the frequency
                this.bassSynth.sine.frequency.setValue(this.bassSynthFreqs[user]);
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

    AudioletApp.prototype.playOrgan = function() {
      // High synth - scheduled as a mono synth (i.e. one instance keeps
      // running and the gate and frequency are switched)
      this.organ = new Organ(this.audiolet);
      this.organFreq = "http://localhost:3000/assets/c3.wav";

      // Connect it to the output so we can hear it
      this.organ.connect(this.audiolet.output);

      // Schedule the patterns to play
      this.organEvent = this.audiolet.scheduler.play([], .5,
          function() {
              // Set the gate
              this.organ.trigger.trigger.setValue(1);

              this.organ.buffy.load(this.organFreq);
              this.organ.organ = new BufferPlayer(this.audiolet, this.organ.buffy);

              // Calculate the frequency from the scale
              // Set the frequency
              //this.highSynth.sine.frequency.setValue(this.highSynthFreq);
          }.bind(this)
      );
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
