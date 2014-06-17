var kickDrumFiles = {
  1: '/audios/drums/drum-beat1.mp3',
  2: '/audios/drums/bassline-beat.mp3',
  3: '/audios/drums/epiano-beat.mp3',
  4: '/audios/drums/conga-beat.mp3',
  5: '/audios/drums/cj-beat.mp3'
}

var kickDrumAudioBuffer = {};

beatPlaying = {
  1: true,
  2: false,
  3: false,
  4: false,
  5: false
}

var KickDrum = window.KickDrum = function(ctx) {
  this.ctx = ctx;
  this.source = null;
};

KickDrum.loadAllFiles = function(ctx, callback){
  for (var key in kickDrumFiles) {
    KickDrum.loadSoundFile(kickDrumFiles[key], key, ctx, callback);
  }
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

KickDrum.playSound = function(ctx, analyser) {
  // source is global so we can call .noteOff() later.
  var now = ctx.currentTime;
  var timeToPlay = (Math.floor(now) + 1);
	$('.modal-loading').modal('hide')
  var gainNode = ctx.createGain();

  var sources = {};
  for (var key in kickDrumAudioBuffer){
    sources[key] = ctx.createBufferSource();
    sources[key].buffer = kickDrumAudioBuffer[key];
    sources[key].connect(gainNode);
  }

  gainNode.gain.setTargetAtTime(instrumentGains['Drums'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + 3.9, 0.1);

  gainNode.connect(analyser);
  analyser.connect(ctx.destination);

  for (var key in sources){
    if (beatPlaying[key]){
      sources[key].start(timeToPlay);
    }
  }
}
