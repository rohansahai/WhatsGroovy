var wildSynthFiles = {
  1: '/audios/wild-synth/a5.mp3',
  2: '/audios/wild-synth/g4.mp3',
  3: '/audios/wild-synth/e4.mp3',
  4: '/audios/wild-synth/d4.mp3',
  5: '/audios/wild-synth/c4.mp3',
  6: '/audios/wild-synth/a4.mp3',
  7: '/audios/wild-synth/g3.mp3',
  8: '/audios/wild-synth/e3.mp3',
  9: '/audios/wild-synth/d3.mp3',
  10: '/audios/wild-synth/c3.mp3',
  11: '/audios/wild-synth/a3.mp3'
}

wildSynthAudioBuffer = {};

var WildSynth = window.WildSynth = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.analyser = analyser;
};

WildSynth.loadAllFiles = function(ctx){
  for (var key in wildSynthFiles) {
    WildSynth.loadSoundFile(wildSynthFiles[key], key, ctx);
  }
}

WildSynth.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    WildSynth.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


WildSynth.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    wildSynthAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

WildSynth.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

WildSynth.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  var gainNode = this.ctx.createGain();
  var source = this.ctx.createBufferSource();
	
	var panner = this.ctx.createPanner();
	panner.panningModel = 'equalpower';
	var xPan = panning['WildSynth'];
	panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

  //this.source.buffer = this.audioBuffer;
  source.buffer = wildSynthAudioBuffer[this.frequency];
  source.loop = false;

  gainNode.gain.setTargetAtTime(instrumentGains['WildSynth'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + .1, 0.1);

  source.connect(panner);
	panner.connect(gainNode);
  //this.feedbackGainNode.connect(this.delayNode);
  gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  // this.pannerNode.connect(this.ctx.destination);

  source.start(timeToPlay); // Play immediately.
}

WildSynth.prototype.stopSound = function() {
  var now = this.ctx.currentTime;
  this.gainNode.gain.setTargetAtTime(0.0, now + .1, 0.1);
}
