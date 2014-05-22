$(function(){
  var HighSynth = window.HighSynth = function(audiolet) {
      AudioletGroup.call(this, audiolet, 0, 1);

      // Triangle base oscillator
      this.sine = new Triangle(audiolet);

      // var buffy = new AudioletBuffer(1,1);
      // buffy.load("http://localhost:3000/assets/e3.wav");
      // var buffyReal = new BufferPlayer(audiolet, buffy);
      // buffyReal.connect(this.outputs[0]);


      // Note on trigger
      this.trigger = new TriggerControl(audiolet);

      // Gain envelope
      this.gainEnv = new PercussiveEnvelope(audiolet, 0, 0.1, 0.15);
      this.gainEnvMulAdd = new MulAdd(audiolet, 0.7); //INCREASE VOLUME WITH SECOND PARAMETER HERE
      this.gain = new Gain(audiolet);

      // Feedback delay
      this.delay = new Delay(audiolet, 0.1, 0.1);
      this.feedbackLimiter = new Gain(audiolet, 0.5);

      // Reverb
      this.reverb = new Reverb(audiolet);

      // Stereo panner
      this.pan = new Pan(audiolet);
      this.panLFO = new Sine(audiolet, 1 / 8);


      // Connect oscillator
      this.sine.connect(this.gain);

      // Connect trigger and envelope
      this.trigger.connect(this.gainEnv);
      this.gainEnv.connect(this.gainEnvMulAdd);
      this.gainEnvMulAdd.connect(this.gain, 0, 1);
      this.gain.connect(this.delay);

      // Connect delay
      this.delay.connect(this.feedbackLimiter);
      this.feedbackLimiter.connect(this.delay);
      this.gain.connect(this.pan);
      this.delay.connect(this.pan);

      this.reverb.connect(this.pan);

      // Connect panner
      this.panLFO.connect(this.pan, 0, 1);
      this.pan.connect(this.outputs[0]);
  }
  extend(HighSynth, AudioletGroup);

  var Organ = window.Organ = function(audiolet) {
      AudioletGroup.call(this, audiolet, 0, 1);


      this.buffy = new AudioletBuffer(1,1);
      this.buffy.load("http://localhost:3000/assets/c3.wav");
      this.organ = new BufferPlayer(audiolet, this.buffy);
      //this.organ.frequency = new AudioletParameter(this.organ, 0, 440);
      //this.organ.phase = 0;

      // Note on trigger
      this.trigger = new TriggerControl(audiolet);

      // Gain envelope
      //this.gainEnv = new PercussiveEnvelope(audiolet, 0, 0.1, 0.15);
      //this.gainEnvMulAdd = new MulAdd(audiolet, 0.4); //INCREASE VOLUME WITH SECOND PARAMETER HERE
      this.gain = new Gain(audiolet);

      // Feedback delay
      this.delay = new Delay(audiolet, 0.1, 0.1);
      this.feedbackLimiter = new Gain(audiolet, 0.5);

      // Reverb
      //this.reverb = new Reverb(audiolet);

      // Stereo panner
      this.pan = new Pan(audiolet);
      this.panLFO = new Sine(audiolet, 1 / 8);


      // Connect oscillator
      this.organ.connect(this.gain);

      // Connect trigger and envelope
      //this.trigger.connect(this.gainEnv);
      //this.gainEnv.connect(this.gainEnvMulAdd);
      //this.gainEnvMulAdd.connect(this.gain, 0, 1);
      this.gain.connect(this.delay);

      // Connect delay
      this.delay.connect(this.feedbackLimiter);
      this.feedbackLimiter.connect(this.delay);
      this.gain.connect(this.pan);
      this.delay.connect(this.pan);

      //this.reverb.connect(this.pan);

      // Connect panner
      this.panLFO.connect(this.pan, 0, 1);
      this.pan.connect(this.outputs[0]);
  }
  extend(Organ, AudioletGroup);

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

  var BassSynth = window.BassSynth = function(audiolet) {
        AudioletGroup.call(this, audiolet, 0, 1);
        // Basic wave
        this.sine = new Sine(audiolet, 100);

        // Frequency Modulator
        this.fmEnv = new PercussiveEnvelope(audiolet, 10, 10, 2);
        this.fmEnvMulAdd = new MulAdd(audiolet, 90, 0);
        this.frequencyModulator = new Saw(audiolet);
        this.frequencyMulAdd = new MulAdd(audiolet, 90, 100);

        // Gain envelope
        this.gain = new Gain(audiolet);
        this.gainEnv = new ADSREnvelope(audiolet,
                                        1, // Gate
                                        1, // Attack
                                        0.2, // Decay
                                        0.9, // Sustain
                                        2); // Release
        this.gainEnvMulAdd = new MulAdd(audiolet, 0.2);

        this.upMixer = new UpMixer(audiolet, 2);

        // Connect main signal path
        this.sine.connect(this.gain);
        this.gain.connect(this.upMixer);
        this.upMixer.connect(this.outputs[0]);

        // Connect Frequency Modulator
        this.fmEnv.connect(this.fmEnvMulAdd);
        this.fmEnvMulAdd.connect(this.frequencyMulAdd, 0, 1);
        this.frequencyModulator.connect(this.frequencyMulAdd);
        this.frequencyMulAdd.connect(this.sine);

        // Connect Envelope
        this.gainEnv.connect(this.gainEnvMulAdd);
        this.gainEnvMulAdd.connect(this.gain, 0, 1);
    }
    extend(BassSynth, AudioletGroup);
})
