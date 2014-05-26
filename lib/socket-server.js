var socketio = require('socket.io');
var _ = require('lodash');
var guestnumber = 1;
var nicknames = {};
var namesUsed = [];
var currentRooms = {};

var assignGuestName = function(socket, io, nickname) {
  var guestName = nickname;
  guestnumber += 1;
  nicknames[socket.id] = guestName;
}

var joinRoom = function(socket, io, room) {
  console.log("JOINING ROOM ", room);
  socket.join(room);
  currentRooms[socket.id] = room;
  io.sockets.in(room).emit('message', {
    text: (nicknames[socket.id] + " has joined " + room + "."),
    room: room
  });
}

var handleDisconnection = function(socket, io) {
  socket.on('disconnect', function() {
    var nameIndex = namesUsed.indexOf(nicknames[socket.id]);
    delete namesUsed[nameIndex];
    var leavingRoom = currentRooms[socket.id];
    io.sockets.in(leavingRoom).emit('message', {
      text: (nicknames[socket.id] + " is leaving" + leavingRoom + "."),
      room: leavingRoom
    })

    io.sockets.emit('removeCursor', {nickname: nicknames[socket.id]});

    delete nicknames[socket.id];
    delete currentRooms[socket.id];
  })
}

var getRoomData = function(io){
  var roomHash = io.sockets.manager.rooms;
  var roomData = {};
  _.each(_.keys(roomHash), function(key){
    var socketIDs = roomHash[key];
    var usernames = _.map(socketIDs, function(id){
      return nicknames[id];
    });
    roomData[key] = usernames;
  });
  return roomData;
}

var handleAudioRequests = function(socket, io){
  socket.on('playAudioRequest', function(data){
    socket.broadcast.to(data.room).emit('playAudioSend', {
      row: data.row,
      instrument: data.instrument,
      socketId: socket.id
    });
  });

  socket.on('stopAudioRequest', function(data){
    socket.broadcast.to(data.room).emit('stopAudioSend', {
      row: data.row,
      fromMove: data.fromMove,
      socketId: socket.id,
      instrument: data.instrument
    });
  });
}

var handleMouseMove = function(socket, io){
  socket.on('moveCursorRequest', function(data){
    socket.broadcast.to(data.room).emit('moveCursorSend', {
      mouseX: data.mouseX,
      mouseY: data.mouseY,
      nickname: nicknames[socket.id]
    })
  });
}

var handleRoomEvents = function(socket, io, room){
  handleDisconnection(socket, io);

  handleAudioRequests(socket, io);
  handleMouseMove(socket, io);
  io.sockets.in(room).emit('roomList', getRoomData(io));
}

var handleEnterRoomRequest = function(socket, io){
  socket.on('enterRoomRequest', function(data) {
    assignGuestName(socket, io, data.nickname)
    joinRoom(socket, io, data.room);
    socket.emit('renderHomePage', data.nickname);
    var rooms = getCurrentRooms();
    io.sockets.emit('showCurrentRooms', rooms);
    handleRoomEvents(socket, io, data.room);
  })

}

var getCurrentRooms = function(){
  var rooms = [];
  for(var key in currentRooms) {
    rooms.push(currentRooms[key]);
  }
  return rooms.getUnique();
}

var socketIOListen = function(server){
	var io = socketio.listen(server);

	io.sockets.on('connection', function(socket){
    var rooms = getCurrentRooms();
    io.sockets.emit('showCurrentRooms', rooms);
		console.log("received connection from: ", socket.id);
    handleEnterRoomRequest(socket, io);
	});
}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

exports.socketIOListen = socketIOListen;
