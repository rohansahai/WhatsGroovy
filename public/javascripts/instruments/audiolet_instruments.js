$(function(){
  var Kick = window.Kick = function(audiolet) {
      AudioletGroup.call(this, audiolet, 0, 1);
      // Main sine oscillator
      this.sine = new Sine(audiolet, 160);

      // Pitch Envelope - from 81 to 1 hz in 0.3 seconds
      this.pitchEnv = new PercussiveEnvelope(audiolet, 1, 0.001, 0.3);
      this.pitchEnvMulAdd = new MulAdd(audiolet, 80, 1);

      // Gain Envelope
      this.gainEnv = new PercussiveEnvelope(audiolet, 1, 0.001, 0.3,
          function() {
              // Remove the group ASAP when env is complete
              this.audiolet.scheduler.addRelative(0,
                                                  this.remove.bind(this));
          }.bind(this)
      );
      this.gainEnvMulAdd = new MulAdd(audiolet, 0.7);
      this.gain = new Gain(audiolet);
      this.upMixer = new UpMixer(audiolet, 2);


      // Connect oscillator
      this.sine.connect(this.gain);

      // Connect pitch envelope
      this.pitchEnv.connect(this.pitchEnvMulAdd);
      this.pitchEnvMulAdd.connect(this.sine);

      // Connect gain envelope
      this.gainEnv.connect(this.gainEnvMulAdd);
      this.gainEnvMulAdd.connect(this.gain, 0, 1);
      this.gain.connect(this.upMixer);
      this.upMixer.connect(this.outputs[0]);
  }
  extend(Kick, AudioletGroup);

  var Shaker = window.Shaker = function(audiolet) {
        AudioletGroup.call(this, audiolet, 0, 1);
        // White noise source
        this.white = new WhiteNoise(audiolet);

        // Gain envelope
        this.gainEnv = new PercussiveEnvelope(audiolet, 1, 0.01, 0.05,
            function() {
                // Remove the group ASAP when env is complete
                this.audiolet.scheduler.addRelative(0,
                                                    this.remove.bind(this));
            }.bind(this)
        );
        this.gainEnvMulAdd = new MulAdd(audiolet, 0.15);
        this.gain = new Gain(audiolet);

        // Filter
        this.filter = new BandPassFilter(audiolet, 3000);

        this.upMixer = new UpMixer(audiolet, 2);

        // Connect the main signal path
        this.white.connect(this.filter);
        this.filter.connect(this.gain);

        // Connect the gain envelope
        this.gainEnv.connect(this.gainEnvMulAdd);
        this.gainEnvMulAdd.connect(this.gain, 0, 1);
        this.gain.connect(this.upMixer);
        this.upMixer.connect(this.outputs[0]);
    }
    extend(Shaker, AudioletGroup);
})
