var harpChordFiles = {
	1: '/audios/harp-chord/a5.wav',
  2: '/audios/harp-chord/g4.wav',
  3: '/audios/harp-chord/e4.wav',
  4: '/audios/harp-chord/d4.wav',
  5: '/audios/harp-chord/c4.wav',
  6: '/audios/harp-chord/a4.wav',
  7: '/audios/harp-chord/g3.wav',
  8: '/audios/harp-chord/e3.wav',
  9: '/audios/harp-chord/d3.wav',
  10: '/audios/harp-chord/c3.wav',
  11: '/audios/harp-chord/a3.wav'
}

harpChordAudioBuffer = {};

var HarpChord = window.HarpChord = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.analyser = analyser;
  this.source = null;
};

HarpChord.loadAllFiles = function(ctx){
  for (var key in harpChordFiles) {
    HarpChord.loadSoundFile(harpChordFiles[key], key, ctx);
  }
}

HarpChord.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    HarpChord.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


HarpChord.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    harpChordAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

HarpChord.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

HarpChord.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  this.gainNode = this.ctx.createGain();
  this.source = this.ctx.createBufferSource();
	
	this.panner = this.ctx.createPanner();
	this.panner.panningModel = 'equalpower';
	var xPan = panning['HarpChord'];
	this.panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = harpChordAudioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetAtTime(1.5, timeToPlay, 0.01);
  this.gainNode.gain.setTargetAtTime(0.0, timeToPlay + .5, 0.1);

  this.source.connect(this.panner);
	this.panner.connect(this.gainNode);
  this.gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  this.source.start(timeToPlay); // Play immediately.
}
