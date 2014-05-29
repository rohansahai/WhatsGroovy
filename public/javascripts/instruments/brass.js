var brassFiles = {
	1: '/audios/brass/a5.wav',
  2: '/audios/brass/g4.wav',
  3: '/audios/brass/e4.wav',
  4: '/audios/brass/d4.wav',
  5: '/audios/brass/c4.wav',
  6: '/audios/brass/a4.wav',
  7: '/audios/brass/g3.wav',
  8: '/audios/brass/e3.wav',
  9: '/audios/brass/d3.wav',
  10: '/audios/brass/c3.wav',
  11: '/audios/brass/a3.wav'
}

brassAudioBuffer = {};

var Brass = window.Brass = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.source = null;
  this.analyser = analyser;
};

Brass.loadAllFiles = function(ctx){
  for (var key in brassFiles) {
    Brass.loadSoundFile(brassFiles[key], key, ctx);
  }
}

Brass.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    Brass.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


Brass.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    brassAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

Brass.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

Brass.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  this.gainNode = this.ctx.createGain();
  this.source = this.ctx.createBufferSource();
	
	this.panner = this.ctx.createPanner();
	this.panner.panningModel = 'equalpower';
	var xPan = panning['Brass'];
	this.panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = brassAudioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetAtTime(instrumentGains['Brass'], timeToPlay, 0.01);
  this.gainNode.gain.setTargetAtTime(0.0, timeToPlay + .1, 0.1);

  this.source.connect(this.panner);
	this.panner.connect(this.gainNode);
  this.gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  this.source.start(timeToPlay); // Play immediately.
}
