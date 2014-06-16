var kickDrumFiles = {
  1: '/audios/drums/simplerBeat.mp3',
  2: '/audios/drums/bass-beat.mp3'
}

kickDrumAudioBuffer = {};

var KickDrum = window.KickDrum = function(ctx) {
  this.ctx = ctx;
  this.source = null;
};

KickDrum.loadAllFiles = function(ctx, callback){
  for (var key in kickDrumFiles) {
    KickDrum.loadSoundFile(kickDrumFiles[key], key, ctx, callback);
  }
  //KickDrum.loadSoundFile(kickDrumFiles[1], ctx, callback);
}

KickDrum.loadSoundFile = function(url, key, ctx, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    KickDrum.initSound(this.response, key, ctx, callback); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


KickDrum.initSound = function(arrayBuffer, key, ctx, callback) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    kickDrumAudioBuffer[key] = buffer;
    if (key === '1'){ 
      callback();
    }
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

KickDrum.playSound = function(ctx, analyser, track) {
  // source is global so we can call .noteOff() later.
  var now = ctx.currentTime;
  var timeToPlay = (Math.floor(now) + 1);
	$('.modal-loading').modal('hide')
  var gainNode = ctx.createGain();
  var source = ctx.createBufferSource();

  source.buffer = kickDrumAudioBuffer[track];
  source.loop = false;

  gainNode.gain.setTargetAtTime(instrumentGains['Drums'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + 3.9, 0.1);

  source.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(ctx.destination);

  source.start(timeToPlay);
}
