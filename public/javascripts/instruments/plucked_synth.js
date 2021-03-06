var pluckedSynthFiles = {
	1: '/audios/plucked-synth/a5.mp3',
  2: '/audios/plucked-synth/g4.mp3',
  3: '/audios/plucked-synth/e4.mp3',
  4: '/audios/plucked-synth/d4.mp3',
  5: '/audios/plucked-synth/c4.mp3',
  6: '/audios/plucked-synth/a4.mp3',
  7: '/audios/plucked-synth/g3.mp3',
  8: '/audios/plucked-synth/e3.mp3',
  9: '/audios/plucked-synth/d3.mp3',
  10: '/audios/plucked-synth/c3.mp3',
  11: '/audios/plucked-synth/a3.mp3'
}

pluckedSynthAudioBuffer = {};

var PluckedSynth = window.PluckedSynth = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.analyser = analyser;
};

PluckedSynth.loadAllFiles = function(ctx){
  for (var key in pluckedSynthFiles) {
    PluckedSynth.loadSoundFile(pluckedSynthFiles[key], key, ctx);
  }
}

PluckedSynth.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    PluckedSynth.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


PluckedSynth.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    pluckedSynthAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

PluckedSynth.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

PluckedSynth.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  var gainNode = this.ctx.createGain();
  var source = this.ctx.createBufferSource();
	
	panner = this.ctx.createPanner();
	panner.panningModel = 'equalpower';
	var xPan = panning['PluckedSynth'];
	panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

  //this.source.buffer = this.audioBuffer;
  source.buffer = pluckedSynthAudioBuffer[this.frequency];
  source.loop = false;

  gainNode.gain.setTargetAtTime(instrumentGains['PluckedSynth'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + .5, 0.1);

  source.connect(panner);
	panner.connect(gainNode);
  gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  source.start(timeToPlay); // Play immediately.
}
