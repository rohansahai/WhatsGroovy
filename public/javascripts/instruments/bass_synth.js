var bassSynthFiles = {
	1: '/audios/bass-synth/a5.mp3',
  2: '/audios/bass-synth/g4.mp3',
  3: '/audios/bass-synth/e4.mp3',
  4: '/audios/bass-synth/d4.mp3',
  5: '/audios/bass-synth/c4.mp3',
  6: '/audios/bass-synth/a4.mp3',
  7: '/audios/bass-synth/g3.mp3',
  8: '/audios/bass-synth/e3.mp3',
  9: '/audios/bass-synth/d3.mp3',
  10: '/audios/bass-synth/c3.mp3',
  11: '/audios/bass-synth/a3.mp3'
}

bassSynthAudioBuffer = {};

var BassSynth = window.BassSynth = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.analyser = analyser;
};

BassSynth.loadAllFiles = function(ctx){
  for (var key in bassSynthFiles) {
    BassSynth.loadSoundFile(bassSynthFiles[key], key, ctx);
  }
}

BassSynth.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    BassSynth.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


BassSynth.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    bassSynthAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

BassSynth.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

BassSynth.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  var gainNode = this.ctx.createGain();
  var source = this.ctx.createBufferSource();
	var panner = this.ctx.createPanner();
	panner.panningModel = 'equalpower';
	var xPan = panning['BassSynth'];
	panner.setPosition(xPan, 0, 1 - Math.abs(xPan));
	
  source.buffer = bassSynthAudioBuffer[this.frequency];
  source.loop = false;

  gainNode.gain.setTargetAtTime(instrumentGains['BassSynth'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + .5, 0.1);

  source.connect(panner);
	panner.connect(gainNode);
  gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  source.start(timeToPlay); // Play immediately.
}
