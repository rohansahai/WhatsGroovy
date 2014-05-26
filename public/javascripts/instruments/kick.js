var kickDrumFiles = {
  1: '/audios/drums/shortBeat.wav',
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

KickDrum.playSound = function(ctx) {
  // source is global so we can call .noteOff() later.
  var now = ctx.currentTime;
  var timeToPlay = (Math.floor(now/4) + 1) * 4;
  var gainNode = ctx.createGainNode();
  var source = ctx.createBufferSource();

  //this.source.buffer = this.audioBuffer;
  source.buffer = kickDrumAudioBuffer[1];
  source.loop = false;

  //gainNode.gain.setTargetValueAtTime(0.5, timeToPlay, 0.01);
  gainNode.gain.setTargetValueAtTime(0.0, now + 3.9, 0.1);

  source.connect(gainNode);
  //this.feedbackGainNode.connect(this.delayNode);
  gainNode.connect(ctx.destination);

  // this.pannerNode.connect(this.ctx.destination);

  source.noteOn(now); // Play immediately.
}
