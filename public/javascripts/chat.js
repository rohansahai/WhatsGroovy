(function(root){
  var ChatApp = root.ChatApp = (root.ChatApp || {});
  var Chat = ChatApp.Chat = function(socket){
  	this.socket = socket;
  	this.room = "lobby"; // TODO: how to set from server?
  }

  Chat.prototype.sendMessage = function(text){
  	this.socket.emit('message', { text: text, room: this.room });
  }

  Chat.prototype.joinRoom = function(room){
    this.room = room;
    this.socket.emit('roomChangeRequest', room);
    this.sendMessage("Switched to " + room);
  }

  Chat.prototype.enterRoom = function(room, nickname){
    this.room = room;
    this.socket.emit('enterRoomRequest', {
      room: room,
      nickname: nickname
    });
  }

  Chat.prototype.processCommand = function(command){
    commandArgs = command.split(' ');
    switch(commandArgs[0]) {
     case 'nick':
       var newName = commandArgs[1];
       this.socket.emit('nicknameChangeRequest', newName);
       break;
     case 'join':
       var newRoom = commandArgs[1];
       this.joinRoom(newRoom);
       break;
     default:
       this.socket.emit('message', { text: "unrecognized command" });
       break;
    }
  }

  Chat.prototype.sendAudio = function(freq, row, instrument){
    this.socket.emit('playAudioRequest', {
      freq: freq,
      row: row,
      instrument: instrument,
      room: this.room
    });
  }

  Chat.prototype.stopAudio = function(evt, row, fromMove, instrument){
    this.socket.emit('stopAudioRequest', {
      evt: evt,
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
