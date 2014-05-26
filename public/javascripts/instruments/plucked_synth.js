var pluckedSynthFiles = {
  1: '/audios/plucked-synth/a3.wav',
  2: '/audios/plucked-synth/c3.wav',
  3: '/audios/plucked-synth/d3.wav',
  4: '/audios/plucked-synth/e3.wav',
  5: '/audios/plucked-synth/g3.wav',
  6: '/audios/plucked-synth/a4.wav',
  7: '/audios/plucked-synth/c4.wav',
  8: '/audios/plucked-synth/d4.wav',
  9: '/audios/plucked-synth/e4.wav',
  10: '/audios/plucked-synth/g4.wav'
}

pluckedSynthAudioBuffer = {};

var PluckedSynth = window.PluckedSynth = function(ctx) {
  // Create an audio context.
  this.ctx = ctx;
  this.source = null;
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
  this.gainNode = this.ctx.createGainNode();
  this.source = this.ctx.createBufferSource();

  //this.source.buffer = this.audioBuffer;
  this.source.buffer = pluckedSynthAudioBuffer[this.frequency];
  this.source.loop = false;

  this.gainNode.gain.setTargetValueAtTime(3, timeToPlay, 0.01);
  this.gainNode.gain.setTargetValueAtTime(0.0, timeToPlay + .5, 0.1);

  this.source.connect(this.gainNode);;
  this.gainNode.connect(this.ctx.destination);

  this.source.noteOn(timeToPlay); // Play immediately.
}
