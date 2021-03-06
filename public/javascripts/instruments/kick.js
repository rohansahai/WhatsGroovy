var kickDrumFiles = {
  1: '/audios/drums/simplerBeat.mp3',
}

kickDrumAudioBuffer = {};

var KickDrum = window.KickDrum = function(ctx) {
  this.ctx = ctx;
  this.source = null;
};

KickDrum.loadAllFiles = function(ctx, callback){

  KickDrum.loadSoundFile(kickDrumFiles[1], ctx, callback);

}

KickDrum.loadSoundFile = function(url, ctx, callback) {
  var xhr = new XMLHttpRequest();
  //http://localhost:8080 local hosting!
  //http://whatsgroovy.herokuapp.com  heroku hosting!
  xhr.open('GET', hostUrl + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    KickDrum.initSound(this.response, ctx, callback); // this.response is an ArrayBuffer.
  };
  xhr.send();
}


KickDrum.initSound = function(arrayBuffer, ctx, callback) {
  ctx.decodeAudioData(arrayBuffer, function(buffer) {
    kickDrumAudioBuffer[1] = buffer;
    callback(ctx);
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

KickDrum.playSound = function(ctx, analyser) {
  // source is global so we can call .noteOff() later.
  var now = ctx.currentTime;
  var timeToPlay = (Math.floor(now) + 1);
	console.log("time now: " + now);
  console.log("time to play: " + timeToPlay);
	$('.modal-loading').modal('hide')
  var gainNode = ctx.createGain();
  var source = ctx.createBufferSource();

  source.buffer = kickDrumAudioBuffer[1];
  source.loop = false;

  gainNode.gain.setTargetAtTime(instrumentGains['Drums'], timeToPlay, 0.01);
  gainNode.gain.setTargetAtTime(0.0, timeToPlay + 3.9, 0.1);

  source.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(ctx.destination);

  source.start(timeToPlay);
}
