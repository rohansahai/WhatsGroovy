var steelDrumFiles = {
	1: '/audios/steel-drums/a5.wav',
  2: '/audios/steel-drums/g4.wav',
  3: '/audios/steel-drums/e4.wav',
  4: '/audios/steel-drums/d4.wav',
  5: '/audios/steel-drums/c4.wav',
  6: '/audios/steel-drums/a4.wav',
  7: '/audios/steel-drums/g3.wav',
  8: '/audios/steel-drums/e3.wav',
  9: '/audios/steel-drums/d3.wav',
  10: '/audios/steel-drums/c3.wav',
  11: '/audios/steel-drums/a3.wav'
}

steelDrumAudioBuffer = {};

var SteelDrum = window.SteelDrum = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.source = null;
  this.analyser = analyser;
};

SteelDrum.loadAllFiles = function(ctx){
  for (var key in steelDrumFiles) {
    SteelDrum.loadSoundFile(steelDrumFiles[key], key, ctx);
  }
}

SteelDrum.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    SteelDrum.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


SteelDrum.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    steelDrumAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

SteelDrum.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

SteelDrum.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  this.gainNode = this.ctx.createGain();
  this.source = this.ctx.createBufferSource();
	
	this.panner = this.ctx.createPanner();
	this.panner.panningModel = 'equalpower';
	var xPan = panning['SteelDrum'];
	this.panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = steelDrumAudioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetAtTime(instrumentGains['SteelDrum'], timeToPlay, 0.01);
  this.gainNode.gain.setTargetAtTime(0.0, timeToPlay + .1, 0.1);

  this.source.connect(this.panner);
	this.panner.connect(this.gainNode);
  this.gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  this.source.start(timeToPlay); // Play immediately.
}
