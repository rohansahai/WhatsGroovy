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
  xhr.open('GET', 'http://localhost:8080' + url, true);
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
  this.gainNode = this.ctx.createGainNode();
  this.source = this.ctx.createBufferSource();

  this.source.buffer = this.audioBuffer;
  this.source.loop = false;

  //this.gainNode.gain.value = 0.5;
  this.gainNode.gain.setTargetValueAtTime(0.0, now + .1, 0.1);

  //this.gainNode.connect(this.ctx.destination);
  this.source.connect(this.gainNode);
  this.gainNode.connect(this.ctx.destination);
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
