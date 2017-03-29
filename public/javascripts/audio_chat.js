(function(root){
  var AudioApp = root.AudioApp = (root.AudioApp || {});
  var AudioChat = AudioApp.AudioChat = function(socket){
  	this.socket = socket;
  }

  AudioChat.prototype.enterRoom = function(room, nickname){
    //this.room = room; handling this on server side because of auto assigned rooms
    this.socket.emit('enterRoomRequest', {
      room: room,
      nickname: nickname
    });
  };

  AudioChat.prototype.sendAudio = function(row, instrument){
    this.socket.emit('playAudioRequest', {
      row: row,
      instrument: instrument,
      room: this.room
    });
  };

  AudioChat.prototype.stopAudio = function(row, fromMove, instrument){
    this.socket.emit('stopAudioRequest', {
      row: row,
      fromMove: fromMove,
      instrument: instrument,
      room: this.room
    });
  };

  AudioChat.prototype.sendMouseCoords = function(mouseX, mouseY){
    this.socket.emit('moveCursorRequest', {
      mouseX: mouseX,
      mouseY: mouseY,
      room: this.room
    })
  };

  AudioChat.prototype.requestBotOff = function(){
    this.socket.emit('requestBotOff');
  };

  AudioChat.prototype.requestBotOn = function(){
    this.socket.emit('requestBotOn');
  };
})(this);
