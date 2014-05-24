var LoadedSound = window.LoadedSound = function(ctx) {
  // Create an audio context.
  this.ctx = ctx;
  this.source = null;
  this.audioBuffer = null;

};

LoadedSound.prototype.loadSoundFile = function(url, callback) {
  var that = this;

  // $.ajax({
  //   method: "GET",
  //   url: url,
  //   dataType: 'arraybuffer',
  //   success: function(data){
  //     that.initSound(data);
  //   }
  // });
  //
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:8080' + url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    debugger
    that.initSound(this.response, callback); // this.response is an ArrayBuffer.
  };
  xhr.send();
}

LoadedSound.prototype.stopSound = function() {
  if (this.source) {
    this.source.noteOff(0);
  }
}

LoadedSound.prototype.playSound = function() {
  // source is global so we can call .noteOff() later.
  this.source = this.ctx.createBufferSource();
  this.source.buffer = this.audioBuffer;
  this.source.loop = false;
  this.source.connect(this.ctx.destination);
  this.source.noteOn(0); // Play immediately.
}

LoadedSound.prototype.initSound = function(arrayBuffer, callback) {
  var that = this;
  this.ctx.decodeAudioData(arrayBuffer, function(buffer) {
    // audioBuffer is global to reuse the decoded audio later.
    that.audioBuffer = buffer;
    callback();
  }, function(e) {
    console.log('Error decoding file', e);
  });
}
