  var SynthPad = window.SynthPad = function(ctx) {
    // Create an audio context.
    this.ctx = ctx;
    this.oscillator = this.ctx.createOscillator();

    this.gainNode = this.ctx.createGainNode();
    this.oscillator.type = 'sine';

    this.gainNode.connect(this.ctx.destination);
    this.oscillator.connect(this.gainNode);

    this.oscillator.start(0);
    this.gainNode.gain.value = 0;

  };


  // Play a note.
  SynthPad.prototype.playSound = function(freq) {
    var now = this.ctx.currentTime;
    this.oscillator.frequency.value = freq;
    this.gainNode.gain.linearRampToValueAtTime(1.0, now + 0.25);
    this.gainNode.gain.linearRampToValueAtTime(0.0, now + .5);
    this.gainNode.gain.linearRampToValueAtTime(1.0, now + .75);
    this.gainNode.gain.linearRampToValueAtTime(0.0, now + 1.0);
    this.gainNode.gain.linearRampToValueAtTime(1.0, now + 1.25);
    this.gainNode.gain.linearRampToValueAtTime(0.0, now + 1.5);

  };


  // Stop the audio.
  SynthPad.prototype.stopSound = function() {
    var now = this.ctx.currentTime;
    //this.gainNode.gain.linearRampToValueAtTime(0.0, now + 0.5);
    this.gainNode.gain.setTargetValueAtTime(0.0, now, 0.3);
    //this.oscillator.stop(0);
  };

  // Update the note frequency.
  SynthPad.prototype.updateFrequency = function(freq) {
    //this.oscillator.start(0);
    this.oscillator.frequency.value = freq;
  };
