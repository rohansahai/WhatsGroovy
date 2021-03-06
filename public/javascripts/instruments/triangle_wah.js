var TriangleWah = window.TriangleWah = function(ctx, analyser) {
  //Create an audio context.
  this.ctx = ctx;
  this.createTunaFx();
  this.analyser = analyser;

  this.oscillator = this.ctx.createOscillator();

  this.gainNode = this.ctx.createGain();
  this.oscillator.type = 'triangle';

  this.oscillator.start(0);
  this.gainNode.gain.value = 0;
	
	this.panner = this.ctx.createPanner();
	this.panner.panningModel = 'equalpower';
	var xPan = panning['TriangleWah'];
	this.panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

};

TriangleWah.prototype.createTunaFx = function(){
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
    this.tunaDelay = new tuna.Delay({
                feedback: 0.45,    //0 to 1+
                delayTime: 150,    //how many milliseconds should the wet signal be delayed?
                wetLevel: 0.25,    //0 to 1+
                dryLevel: 0,       //0 to 1+
                cutoff: 20,        //cutoff frequency of the built in highpass-filter. 20 to 22050
                bypass: 0
            });
}

// Play a note.
TriangleWah.prototype.playSound = function(row) {

  if (this.frequency < 100){ this.frequency = undefined }; //this is a bit hacky, since all the other instruments use the row value to set their note we have to do it differently for internal instruments
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  var freq = this.frequency || frequencies[row];
	
	

  this.oscillator.connect(this.tunaWahWah.input);
  this.tunaWahWah.connect(this.panner);
	this.panner.connect(this.gainNode);
  this.gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  var now = this.ctx.currentTime;
  this.oscillator.frequency.value = freq;
	
	if (freq > 350){
		this.gainNode.gain.setTargetAtTime(0.6, timeToPlay, 0.01);
	} else {
		this.gainNode.gain.setTargetAtTime(instrumentGains['TriangleWah'], timeToPlay, 0.01);
	}
 

  this.gainNode.gain.setTargetAtTime(0.0, timeToPlay + .05, 0.05);

};


// Stop the audio.
TriangleWah.prototype.stopSound = function() {
  var now = this.ctx.currentTime;
  this.gainNode.gain.setTargetAtTime(0.0, now, 0.3);
};

// Update the note frequency.
TriangleWah.prototype.updateFrequency = function(row) {
  this.frequency = frequencies[row];
};
