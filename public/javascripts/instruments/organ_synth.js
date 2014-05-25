var organSynthFiles = {
  1: '/audios/organ/a3.wav',
  2: '/audios/organ/c3.wav',
  3: '/audios/organ/d3.wav',
  4: '/audios/organ/e3.wav',
  5: '/audios/organ/g3.wav',
  6: '/audios/organ/a4.wav',
  7: '/audios/organ/c4.wav',
  8: '/audios/organ/d4.wav',
  9: '/audios/organ/e4.wav',
  10: '/audios/organ/g4.wav'
}

audioBuffer = {};

var OrganSynth = window.OrganSynth = function(ctx) {
  // Create an audio context.
  this.ctx = ctx;
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
  xhr.open('GET', 'http://whatsgroovy.herokuapp.com' + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    OrganSynth.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


OrganSynth.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    audioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}


OrganSynth.prototype.stopSound = function() {
  if (this.source) {
    this.source.noteOff(0);
  }
}

OrganSynth.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

OrganSynth.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  this.filterNode = this.ctx.createBiquadFilter();
  this.gainNode = this.ctx.createGainNode();
  this.feedbackGainNode = this.ctx.createGainNode();
  this.delayNode = this.ctx.createDelayNode();
  this.source = this.ctx.createBufferSource();

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = audioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetValueAtTime(0.5, now, 0.01);
  this.gainNode.gain.setTargetValueAtTime(0.0, now + .1, 0.1);

  this.filterNode.frequency.value = 500;

  this.source.connect(this.filterNode);
  this.filterNode.connect(this.gainNode);
  this.filterNode.connect(this.delayNode);
  this.delayNode.connect(this.feedbackGainNode);
  this.feedbackGainNode.connect(this.gainNode);
  //this.feedbackGainNode.connect(this.delayNode);
  this.gainNode.connect(this.ctx.destination);

  // this.pannerNode.connect(this.ctx.destination);

  this.source.noteOn(0); // Play immediately.
}
