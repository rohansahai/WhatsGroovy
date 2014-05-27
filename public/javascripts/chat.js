(function(root){
  var ChatApp = root.ChatApp = (root.ChatApp || {});
  var Chat = ChatApp.Chat = function(socket){
  	this.socket = socket;
  	this.room = "lobby"; // TODO: how to set from server?
  }

  Chat.prototype.enterRoom = function(room, nickname){
    this.room = room;
    this.socket.emit('enterRoomRequest', {
      room: room,
      nickname: nickname
    });
  }

  Chat.prototype.sendAudio = function(row, instrument){
    this.socket.emit('playAudioRequest', {
      row: row,
      instrument: instrument,
      room: this.room
    });
  }

  Chat.prototype.stopAudio = function(row, fromMove, instrument){
    this.socket.emit('stopAudioRequest', {
      row: row,
      fromMove: fromMove,
      instrument: instrument,
      room: this.room
    });
  }

  Chat.prototype.sendMouseCoords = function(mouseX, mouseY){
    this.socket.emit('moveCursorRequest', {
      mouseX: mouseX,
      mouseY: mouseY,
      room: this.room
    })
  };
})(this);
