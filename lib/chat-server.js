var socketio = require('socket.io');
var _ = require('lodash');
var guestnumber = 1;
var nicknames = {};
var namesUsed = [];
var currentRooms = {};

var assignGuestName = function(socket, io) {
  var guestName = "Guest" + guestnumber;
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

var handleMessages = function(socket, io) {
  socket.on('message', function (data) {
	  io.sockets.in(data.room).emit('message', {
	    text: (nicknames[socket.id] + ":" + data.text),
	    room: data.room
	  })
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

var handleNameChangeRequests = function(socket, io) {
  socket.on('nicknameChangeRequest', function(name) {
    if (name.indexOf('Guest') === 0) {
      socket.emit('nicknameChangeResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else if (namesUsed.indexOf(name) > -1){
      socket.emit('nicknameChangeResult', {
        success: false,
        message: 'That name is taken.'
      });
    } else {
      var room = currentRooms[socket.id];
      var previousName = nicknames[socket.id];
      var previousNameIndex = namesUsed.indexOf(previousName);
      namesUsed.push(name);
      nicknames[socket.id] = name;
      delete namesUsed[previousNameIndex];
      io.sockets.in(room).emit('nicknameChangeResult', {
        success: true,
        text: (previousName + " is now known as " + name + "."),
        name: name
      });
      io.sockets.emit('roomList', getRoomData(io));
    }
  })
}

var handleRoomChangeRequests = function(socket, io){
  socket.on('roomChangeRequest', function(room) {
    var oldRoom = currentRooms[socket.id];
    socket.leave(oldRoom);
    joinRoom(socket, io, room);
    io.sockets.emit('roomList', getRoomData(io));
  })
  handleRoomEvents(socket, io);
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
    socket.broadcast.emit('playAudioSend', {
      freq: data.freq,
      row: data.row,
      instrument: data.instrument,
      socketId: socket.id
    });
  });

  socket.on('stopAudioRequest', function(data){
    socket.broadcast.emit('stopAudioSend', {
      evt: data.evt,
      row: data.row,
      fromMove: data.fromMove,
      socketId: socket.id,
      instrument: data.instrument
    });
  });
}

var handleMouseMove = function(socket, io){
  socket.on('moveCursorRequest', function(data){
    socket.broadcast.in(data.room)emit('moveCursorSend', {
      mouseX: data.mouseX,
      mouseY: data.mouseY,
      nickname: nicknames[socket.id]
    })
  });
}

var handleRoomEvents = function(socket, io){
  assignGuestName(socket, io);
  //joinRoom(socket, io, "lobby");
  handleMessages(socket, io);
  handleNameChangeRequests(socket, io);
  // handleRoomChangeRequests(socket, io);
  handleDisconnection(socket, io);

  handleAudioRequests(socket, io);
  handleMouseMove(socket, io);
  io.sockets.emit('roomList', getRoomData(io));
}

var handleEnterRoomRequest = function(socket, io){
  socket.on('enterRoomRequest', function(room) {
    joinRoom(socket, io, room);
    socket.emit('renderHomePage');
    //io.sockets.emit('roomList', getRoomData(io));
    handleRoomEvents(socket, io);
  })

}

var socketIOListen = function(server){
	var io = socketio.listen(server);

	io.sockets.on('connection', function(socket){
		console.log("received connection from: ", socket.id);
    handleEnterRoomRequest(socket, io);
    //handleRoomChangeRequests(socket, io);
    // handleRoomEvents(socket, io);
	});
}


exports.socketIOListen = socketIOListen;
