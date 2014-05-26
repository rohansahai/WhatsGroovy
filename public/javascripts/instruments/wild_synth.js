var wildSynthFiles = {
  1: '/audios/wild-synth/g4.wav',
  2: '/audios/wild-synth/e4.wav',
  3: '/audios/wild-synth/d4.wav',
  4: '/audios/wild-synth/c4.wav',
  5: '/audios/wild-synth/a4.wav',
  6: '/audios/wild-synth/g3.wav',
  7: '/audios/wild-synth/e3.wav',
  8: '/audios/wild-synth/d3.wav',
  9: '/audios/wild-synth/c3.wav',
  10: '/audios/wild-synth/a3.wav'
}

wildSynthAudioBuffer = {};

var WildSynth = window.WildSynth = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.source = null;
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
  this.gainNode = this.ctx.createGainNode();
  this.source = this.ctx.createBufferSource();

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = wildSynthAudioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetValueAtTime(0.5, timeToPlay, 0.01);
  this.gainNode.gain.setTargetValueAtTime(0.0, timeToPlay + .1, 0.1);

  this.source.connect(this.gainNode);
  //this.feedbackGainNode.connect(this.delayNode);
  this.gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  // this.pannerNode.connect(this.ctx.destination);

  this.source.noteOn(timeToPlay); // Play immediately.
}

WildSynth.prototype.stopSound = function() {
  var now = this.ctx.currentTime;
  this.gainNode.gain.setTargetValueAtTime(0.0, now + .1, 0.1);
}
