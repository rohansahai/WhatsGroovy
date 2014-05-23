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

        this.audioHash = {};
        this.audioHash[0] = this.assignAudioHash();
    };

    AudioletApp.prototype.playCurrentInstrument = function(freq, row, instrument, user) {
      switch (instrument) {
        case 'high synth':
          this.highSynthFreqs[user] = freq;
          if (!this.highSynthEvents[user]){ this.playHighSynth(user);}
          break;
        case 'keys':
          this.playKeys(user, row);
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
        case 'keys':
          this.stopKeys(user, row);
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
      //this.synth.disconnect(this.audiolet.output);
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

    AudioletApp.prototype.playBassSynth = function() {
        // Bass synth - scheduled as a mono synth (i.e. one instance keeps
        // running and the gate and frequency are switched)
        this.bassSynth = new BassSynth(this.audiolet);

        // Connect it to the output so we can hear it
        this.bassSynth.connect(this.audiolet.output);

        // Bassline
        var degreePattern = new PSequence([0, 0, 1, 1, 2, 2, 3, 3],
                                          Infinity);

        // How long each event lasts - gate on for 14, off for 2
        var durationPattern = new PSequence([30, 2], Infinity);

        // Toggle the gate on and off
        var gatePattern = new PSequence([1, 0], Infinity);

        // Schedule the patterns to play
        var patterns = [degreePattern, gatePattern];
        this.audiolet.scheduler.play(patterns, durationPattern,
            function(degree, gate) {
                // Set the gates
                this.bassSynth.gainEnv.gate.setValue(gate);
                this.bassSynth.fmEnv.gate.setValue(gate);
                // Calculate the frequency from the scale
                var frequency = this.scale.getFrequency(degree,
                                                        this.c2Frequency,
                                                        1);
                // Set the frequency
                this.bassSynth.frequencyMulAdd.add.setValue(frequency);
                this.bassSynth.frequencyModulator.frequency.setValue(frequency * 4);
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

    AudioletApp.prototype.playKeys = function(user, row) {
      this.audioHash[user][row].pause();
      this.audioHash[user][row].load();
      this.audioHash[user][row].play();
    }

    AudioletApp.prototype.stopKeys = function(user, row){
      this.audioHash[user][row].pause();
    }

    AudioletApp.prototype.assignAudioHash = function() {
      var audioHash = {}

      var audioElement1 = document.createElement('audio');
      audioElement1.setAttribute('src', 'audios/c3.wav');
      audioHash[1] = audioElement1;

      var audioElement2 = document.createElement('audio');
      audioElement2.setAttribute('src', 'audios/d3.wav');
      audioHash[2] = audioElement2;

      var audioElement3 = document.createElement('audio');
      audioElement3.setAttribute('src', 'audios/e3.wav');
      audioHash[3] = audioElement3;

      var audioElement4 = document.createElement('audio');
      audioElement4.setAttribute('src', 'audios/f3.wav');
      audioHash[4] = audioElement4;

      var audioElement5 = document.createElement('audio');
      audioElement5.setAttribute('src', 'audios/g3.wav');
      audioHash[5] = audioElement5;

      var audioElement6 = document.createElement('audio');
      audioElement6.setAttribute('src', 'audios/a4.wav');
      audioHash[6] = audioElement6;

      var audioElement7 = document.createElement('audio');
      audioElement7.setAttribute('src', 'audios/b4.wav');
      audioHash[7] = audioElement7;

      var audioElement8 = document.createElement('audio');
      audioElement8.setAttribute('src', 'audios/c4.wav');
      audioHash[8] = audioElement8;

      return audioHash;

    }
});
