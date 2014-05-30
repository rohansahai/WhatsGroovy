var harpChordFiles = {
	1: '/audios/harp-chord/a5.mp3',
  2: '/audios/harp-chord/g4.mp3',
  3: '/audios/harp-chord/e4.mp3',
  4: '/audios/harp-chord/d4.mp3',
  5: '/audios/harp-chord/c4.mp3',
  6: '/audios/harp-chord/a4.mp3',
  7: '/audios/harp-chord/g3.mp3',
  8: '/audios/harp-chord/e3.mp3',
  9: '/audios/harp-chord/d3.mp3',
  10: '/audios/harp-chord/c3.mp3',
  11: '/audios/harp-chord/a3.mp3'
}

harpChordAudioBuffer = {};

var HarpChord = window.HarpChord = function(ctx, analyser) {
  // Create an audio context.
  this.ctx = ctx;
  this.analyser = analyser;
};

HarpChord.loadAllFiles = function(ctx){
  for (var key in harpChordFiles) {
    HarpChord.loadSoundFile(harpChordFiles[key], key, ctx);
  }
}

HarpChord.loadSoundFile = function(url, freq, ctx) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    HarpChord.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


HarpChord.initSound = function(arrayBuffer, freq, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    harpChordAudioBuffer[freq] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

HarpChord.prototype.updateFrequency = function(row) {
  this.frequency = row;
}

HarpChord.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  var now = this.ctx.currentTime;
  var timeToPlay = (Math.floor(now/.125) + 1) * .125;
  var gainNode = this.ctx.createGain();
  var source = this.ctx.createBufferSource();
	
	var panner = this.ctx.createPanner();
	panner.panningModel = 'equalpower';
	var xPan = panning['HarpChord'];
	panner.setPosition(xPan, 0, 1 - Math.abs(xPan));

  //this.source.buffer = this.audioBuffer;
  source.buffer = harpChordAudioBuffer[this.frequency];
  source.loop = false;

  gainNode.gain.setTargetAtTime(instrumentGains['HarpChord'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + .5, 0.1);

  source.connect(panner);
	panner.connect(gainNode);
  gainNode.connect(this.analyser);
  this.analyser.connect(this.ctx.destination);

  source.start(timeToPlay); // Play immediately.
}
