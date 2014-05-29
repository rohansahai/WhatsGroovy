var marimbaFiles = {
	1: '/audios/marimba/a5.mp3',
  2: '/audios/marimba/g4.mp3',
  3: '/audios/marimba/e4.mp3',
  4: '/audios/marimba/d4.mp3',
  5: '/audios/marimba/c4.mp3',
  6: '/audios/marimba/a4.mp3',
  7: '/audios/marimba/g3.mp3',
  8: '/audios/marimba/e3.mp3',
  9: '/audios/marimba/d3.mp3',
  10: '/audios/marimba/c3.mp3',
  11: '/audios/marimba/a3.mp3'
}

marimbaAudioBuffer = {};

var Marimba = window.Marimba = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.source = null;
  this.analyser = analyser;
};

Marimba.loadAllFiles = function(ctx){
  for (var key in marimbaFiles) {
    Marimba.loadSoundFile(marimbaFiles[key], key, ctx);
  }
}

Marimba.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    Marimba.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


Marimba.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    marimbaAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

Marimba.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

Marimba.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  this.gainNode = this.ctx.createGain();
  this.source = this.ctx.createBufferSource();
	
	this.panner = this.ctx.createPanner();
	this.panner.panningModel = 'equalpower';
	var xPan = panning['Marimba'];
	this.panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = marimbaAudioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetAtTime(instrumentGains['Marimba'], timeToPlay, 0.01);
  this.gainNode.gain.setTargetAtTime(0.0, timeToPlay + 1, 0.1);

  this.source.connect(this.panner);
	this.panner.connect(this.gainNode);
  this.gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  this.source.start(timeToPlay); // Play immediately.
}
