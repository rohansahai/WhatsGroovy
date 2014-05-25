var SynthPad = window.SynthPad = function(ctx) {
  //Create an audio context.
  this.ctx = ctx;
  this.createTunaFx();
  // this.oscillator = this.ctx.createOscillator();
  //
  // this.gainNode = this.ctx.createGainNode();
  // this.oscillator.type = 'sine';
  //
  // this.gainNode.connect(this.ctx.destination);
  // this.oscillator.connect(this.gainNode);
  //
  // this.oscillator.start(0);
  // this.gainNode.gain.value = 0;
  // this.frequency;

  this.oscillator = this.ctx.createOscillator();
  this.oscillator.type = 'triangle';
  this.oscillator.frequency = 500;
  this.oscillator.connect(this.tunaWahWah.input);
  this.tunaWahWah.connect(this.ctx.destination);
  this.oscillator.noteOn(0);

};

SynthPad.prototype.createTunaFx = function(){
    tuna = new Tuna(this.ctx);

    this.tunaWahWah = new tuna.WahWah({
        automode: true, //true/false
        baseFrequency: 0.5, //0 to 1
        excursionOctaves: 3, //1 to 6
        sweep: 0, //0 to 1
        resonance: 2, //1 to 100
        sensitivity: 1, //-1 to 1
        bypass: 0
    });
    this.tunaPhaser = new tuna.Phaser({
        rate: 1.2, //0.01 to 8 is a decent range, but higher values are possible
        depth: 0.8, //0 to 1
        feedback: 0.9, //0 to 1+
        stereoPhase: 180, //0 to 180
        baseModulationFrequency: 700, //500 to 1500
        bypass: 0
    });
    this.tunaTremolo = new tuna.Tremolo({
        intensity: 0.2, //0 to 1
        rate: 8, //0.001 to 8
        stereoPhase: 0, //0 to 180
        feedback: 0.9, //0 to 1+
        bypass: 0
    });
}

// Play a note.
SynthPad.prototype.playSound = function(freq) {
  var now = this.ctx.currentTime;
  this.oscillator.frequency.value = this.frequency;
  this.gainNode.gain.setTargetValueAtTime(0.5, now, 0.01);

  this.gainNode.gain.setTargetValueAtTime(0.0, now + .1, 0.1);

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
  this.frequency = freq;
};
