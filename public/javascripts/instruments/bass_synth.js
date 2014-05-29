var bassSynthFiles = {
	1: '/audios/bass-synth/a5.wav',
  2: '/audios/bass-synth/g4.wav',
  3: '/audios/bass-synth/e4.wav',
  4: '/audios/bass-synth/d4.wav',
  5: '/audios/bass-synth/c4.wav',
  6: '/audios/bass-synth/a4.wav',
  7: '/audios/bass-synth/g3.wav',
  8: '/audios/bass-synth/e3.wav',
  9: '/audios/bass-synth/d3.wav',
  10: '/audios/bass-synth/c3.wav',
  11: '/audios/bass-synth/a3.wav'
}

bassSynthAudioBuffer = {};

var BassSynth = window.BassSynth = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.analyser = analyser;
  this.source = null;
};

BassSynth.loadAllFiles = function(ctx){
  for (var key in bassSynthFiles) {
    BassSynth.loadSoundFile(bassSynthFiles[key], key, ctx);
  }
}

BassSynth.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    BassSynth.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


BassSynth.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    bassSynthAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

BassSynth.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

BassSynth.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  this.gainNode = this.ctx.createGain();
  this.source = this.ctx.createBufferSource();
	this.panner = this.ctx.createPanner();
	this.panner.panningModel = 'equalpower';
	var xPan = panning['BassSynth'];
	this.panner.setPosition(xPan, 0, 1 - Math.abs(xPan));
	

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = bassSynthAudioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetAtTime(instrumentGains['BassSynth'], timeToPlay, 0.01);
  this.gainNode.gain.setTargetAtTime(0.0, timeToPlay + .5, 0.1);

  this.source.connect(this.panner);
	this.panner.connect(this.gainNode);
  this.gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  this.source.start(timeToPlay); // Play immediately.
}
