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

var OrganSynth = window.OrganSynth = function(ctx) {
  // Create an audio context.
  this.ctx = ctx;
  this.source = null;
  this.audioBuffer = null;

};

OrganSynth.prototype.loadSoundFile = function(url, callback) {
  var that = this;
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  xhr.open('GET', 'http://whatsgroovy.herokuapp.com' + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    that.initSound(this.response, callback); // this.response is an ArrayBuffer.
  };
  xhr.send();
}

OrganSynth.prototype.stopSound = function() {
  if (this.source) {
    this.source.noteOff(0);
  }
}

OrganSynth.prototype.playSound = function() {
  var that = this;
  this.loadSoundFile(organSynthFiles[this.frequency], function(){
    that.playFile();
  });
}

OrganSynth.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

OrganSynth.prototype.playFile = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  this.filterNode = this.ctx.createBiquadFilter();
  this.gainNode = this.ctx.createGainNode();
  this.feedbackGainNode = this.ctx.createGainNode();
  this.delayNode = this.ctx.createDelayNode();
  this.source = this.ctx.createBufferSource();

  this.source.buffer = this.audioBuffer;
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

OrganSynth.prototype.initSound = function(arrayBuffer, callback) {
  var that = this;
  this.ctx.decodeAudioData(arrayBuffer, function(buffer) {
    // audioBuffer is global to reuse the decoded audio later.
    that.audioBuffer = buffer;
    callback();
  }, function(e) {
    console.log('Error decoding file', e);
  });
}
