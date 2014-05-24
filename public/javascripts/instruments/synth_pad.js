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
    this.frequency;

  };


  // Play a note.
  SynthPad.prototype.playSound = function(freq) {
    var now = this.ctx.currentTime;
    this.oscillator.frequency.value = this.frequency;
    //this.gainNode.gain.value = 0.5;
    this.gainNode.gain.setTargetValueAtTime(0.5, now, 0.01);
    var goingUp = false;

    this.gainNode.gain.setTargetValueAtTime(0.0, now + .25, 0.1);
    // this.gainNode.gain.setTargetValueAtTime(0.6, now + .25, 0.1);
    // this.gainNode.gain.setTargetValueAtTime(0.0, now + .5, 0.1);
    // this.gainNode.gain.setTargetValueAtTime(0.6, now + .75, 0.1);
    // this.gainNode.gain.setTargetValueAtTime(0.0, now + 1, 0.1);




    // for (var i = 0; i < 10; i = i + 1) {
    //   if (goingUp === true){
    //     this.gainNode.gain.setTargetValueAtTime(0.6, now + i, 0.3);
    //     goingUp === false;
    //     console.log("going up: " + i);
    //   } else {
    //     console.log("going down: " + i);
    //     this.gainNode.gain.setTargetValueAtTime(0.0, now + i, 0.3);
    //     goingUp = true;
    //   }
    // }

    //this.gainNode.gain.linearRampToValueAtTime(1.0, now + 0.25);

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
    this.frequency.value = freq;
  };
