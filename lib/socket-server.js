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
}

var handleDisconnection = function(socket, io) {
  socket.on('disconnect', function() {
    var nameIndex = namesUsed.indexOf(nicknames[socket.id]);
    delete namesUsed[nameIndex];
    var leavingRoom = currentRooms[socket.id];

    io.sockets.emit('removeCursor', {nickname: nicknames[socket.id]});

    delete nicknames[socket.id];
    delete currentRooms[socket.id];
		
		var rooms = getCurrentRooms();
		io.sockets.emit('showCurrentRooms', rooms);
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
      nickname: nicknames[socket.id]
    });
  });

  socket.on('stopAudioRequest', function(data){
    socket.broadcast.to(data.room).emit('stopAudioSend', {
      row: data.row,
      fromMove: data.fromMove,
      nickname: nicknames[socket.id],
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
}

var handleEnterRoomRequest = function(socket, io){
  socket.on('enterRoomRequest', function(data) {
    //nickname validation and room capacity validation
		if (data.room === ""){
			data.room = autoAssignRoom();
		}
		
		console.log("room name " + data.room);
		
    if (nicknameValidation(data.nickname)){
      socket.emit('renderError',{
        text: "Sorry that nickname is invalid or already chosen!"
      })
    }
    else if (roomValidation(data.room)) {
      socket.emit('renderError',{
        text: "Sorry that room name is invalid!"
      })
    } else if (roomFull(data.room)) {
      socket.emit('renderError',{
        text: "Sorry that room is at max capacity!"
      })
    }
    else {
      assignGuestName(socket, io, data.nickname)
      joinRoom(socket, io, data.room);
      socket.emit('renderHomePage', {
				nickname: data.nickname,
				room: data.room
			});
      var rooms = getCurrentRooms();
      io.sockets.emit('showCurrentRooms', rooms);
      handleRoomEvents(socket, io, data.room);
    }
  })
}

var autoAssignRoom = function(){
	var rooms = getCurrentRooms();
	for (var i = 0; i < rooms.length; i++) {
		if (!roomFull(rooms[i])){
			return rooms[i];
		}
	}

	//ensures we never auto generate a room that exists and is full!
	do {
		var newRoom = Math.floor((Math.random() * 10000) + 1);
	} while(roomFull(newRoom));
	
	return newRoom;
}

var roomFull = function(roomname){
  var rooms = [];
  for(var key in currentRooms) {
    rooms.push(currentRooms[key]);
  }
	var roomSize = rooms.countInArray(roomname);
	
	if (roomSize >= 4){
		return true;
	}
	return false;
};

var nicknameValidation = function(nickname){
  for (var key in nicknames){
		console.log("nickname-" + nicknames[key]);
    if (nicknames[key] === nickname){
      return true
    }
  }

  if (nickname === "" || nickname.length > 20){
    return true
  }

  return false
}

var roomValidation = function(roomname){
	roomname = roomname || "";
  if (roomname === "" || roomname.length > 20){
    return true
  }
  return false
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

Array.prototype.countInArray = function(val) {
    var count = 0;
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            count++;
        }
    }
    return count;
};

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
};

exports.socketIOListen = socketIOListen;
