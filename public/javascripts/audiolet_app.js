function playExample() {
    var Synth = function(audiolet, frequency) {
      AudioletGroup.apply(this, [audiolet, 0, 1]);

      this.audiolet = new Audiolet();
      this.sine = new Sine(this.audiolet, frequency);

      this.modulator = new Saw(this.audiolet, 2 * frequency);
      this.modulatorMulAdd = new MulAdd(this.audiolet, frequency/2, frequency);

      this.gain = new Gain(this.audiolet);
      this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.2, 0.5,
        function() {
            this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
        }.bind(this)
      );


      this.modulator.connect(this.modulatorMulAdd);
      this.modulatorMulAdd.connect(this.sine);
      this.envelope.connect(this.gain, 0, 1);
      this.sine.connect(this.gain);
      this.gain.connect(this.outputs[0]);
    };
    extend(Synth, AudioletGroup);

    var AudioletApp = function() {
        this.audiolet = new Audiolet();

        var frequencyPattern = new PSequence([262, 262, 392, 392], 1);

        this.audiolet.scheduler.play([frequencyPattern], 1,
            function(frequency) {
                var synth = new Synth(this.audiolet, frequency);
                synth.connect(this.audiolet.output);
            }.bind(this)
        );
    };

    this.audioletApp = new AudioletApp();
};
