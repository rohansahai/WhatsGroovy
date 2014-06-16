var BassBeatFiles = {
  1: '/audios/drums/bass-beat.mp3',
}

BassBeatAudioBuffer = {};

var BassBeat = window.BassBeat = function(ctx) {
  this.ctx = ctx;
  this.source = null;
};

BassBeat.loadAllFiles = function(ctx){

  BassBeat.loadSoundFile(BassBeatFiles[1], ctx);

}

BassBeat.loadSoundFile = function(url, ctx) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    BassBeat.initSound(this.response, ctx); //
  };
  xhr.send();
}


BassBeat.initSound = function(arrayBuffer, ctx) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    BassBeatAudioBuffer[1] = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

BassBeat.playSound = function(ctx, analyser) {
  // source is global so we can call .noteOff() later.
  var now = ctx.currentTime;
  var timeToPlay = (Math.floor(now) + 1);
  var gainNode = ctx.createGain();
  var source = ctx.createBufferSource();

  source.buffer = BassBeatAudioBuffer[1];
  source.loop = false;

  gainNode.gain.setTargetAtTime(instrumentGains['Drums'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + 3.9, 0.1);

  source.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(ctx.destination);

  source.start(timeToPlay);
}
