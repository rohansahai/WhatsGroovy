var organSynthFiles = {
	1: '/audios/organ/a5.wav',
  2: '/audios/organ/g4.wav',
  3: '/audios/organ/e4.wav',
  4: '/audios/organ/d4.wav',
  5: '/audios/organ/c4.wav',
  6: '/audios/organ/a4.wav',
  7: '/audios/organ/g3.wav',
  8: '/audios/organ/e3.wav',
  9: '/audios/organ/d3.wav',
  10: '/audios/organ/c3.wav',
  11: '/audios/organ/a3.wav'
}

organSynthAudioBuffer = {};

var OrganSynth = window.OrganSynth = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.analyser = analyser;
  this.source = null;
};

OrganSynth.loadAllFiles = function(ctx){
  for (var key in organSynthFiles) {
    OrganSynth.loadSoundFile(organSynthFiles[key], key, ctx);
  }
}

OrganSynth.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    OrganSynth.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


OrganSynth.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    organSynthAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

OrganSynth.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

OrganSynth.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  this.gainNode = this.ctx.createGain();
  this.source = this.ctx.createBufferSource();
	this.panner = this.ctx.createPanner();
	this.panner.panningModel = 'equalpower';
	var xPan = panning['OrganSynth'];
	this.panner.setPosition(xPan, 0, 1 - Math.abs(xPan));
	

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = organSynthAudioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetAtTime(2, timeToPlay, 0.01);
  this.gainNode.gain.setTargetAtTime(0.0, timeToPlay + .1, 0.1);

  this.source.connect(this.gainNode);
  //this.feedbackGainNode.connect(this.delayNode);
  this.gainNode.connect(this.panner);
	this.panner.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  // this.pannerNode.connect(this.ctx.destination);

  this.source.start(timeToPlay); // Play immediately.
}
