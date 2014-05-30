var organSynthFiles = {
	1: '/audios/organ/a5.mp3',
  2: '/audios/organ/g4.mp3',
  3: '/audios/organ/e4.mp3',
  4: '/audios/organ/d4.mp3',
  5: '/audios/organ/c4.mp3',
  6: '/audios/organ/a4.mp3',
  7: '/audios/organ/g3.mp3',
  8: '/audios/organ/e3.mp3',
  9: '/audios/organ/d3.mp3',
  10: '/audios/organ/c3.mp3',
  11: '/audios/organ/a3.mp3'
}

organSynthAudioBuffer = {};

var OrganSynth = window.OrganSynth = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.analyser = analyser;
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
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  var gainNode = this.ctx.createGain();
  var source = this.ctx.createBufferSource();
	var panner = this.ctx.createPanner();
	panner.panningModel = 'equalpower';
	var xPan = panning['OrganSynth'];
	panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

  source.buffer = organSynthAudioBuffer[this.frequency];
  source.loop = false;

  gainNode.gain.setTargetAtTime(instrumentGains['OrganSynth'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + .1, 0.1);

  source.connect(gainNode);
  //this.feedbackGainNode.connect(this.delayNode);
  gainNode.connect(panner);
	panner.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  // this.pannerNode.connect(this.ctx.destination);

  source.start(timeToPlay); // Play immediately.
}
