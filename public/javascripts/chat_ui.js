(function(root){
  var ChatApp = root.ChatApp = (root.ChatApp || {});
  var socket = io.connect();

  var escapeDivText = function(text) {
  	return $("<div></div>").text(text);
  }

  var processInput = function (chatApp) {
  	var text = $('#send-message').val();
  	if(text[0] === '/'){
      chatApp.processCommand(text.slice(1));
  	} else {
    	chatApp.sendMessage(text);
  	}
  	$("#send-message").val('');
  }

  var updateRoomList = function(roomData){
    $(".room-listings").empty();
    $.each(roomData, function(room, userList){
      if(room.length > 0){
        var roomListing = $("<div></div>").addClass("room-listing");
        roomListing.append($("<h3></h3>").text(room));
        var usersUL = $("<ul></ul>");
        $.each(userList, function(i, username){
          usersUL.append($("<li></li>").text(username));
        });
        roomListing.append(usersUL);
        $(".room-listings").append(roomListing);
      }
    });
  }

  var processAudio = function (chatApp) {
    chatApp.sendAudio();
  }

  $(document).ready(function() {
  	//window.chatApp = new ChatApp.Chat(socket);

    document.onmousemove = function (e) {
      mouseX = e.pageX;
      mouseY = e.pageY;
      chatApp.sendMouseCoords(mouseX, mouseY);
      $("#my-cursor").css({left:e.pageX, top:e.pageY});
    }

    $('.send-form').submit(function(e) {
      e.preventDefault();
      processInput(chatApp);
      return false;
    });

    $('#play').click(function(e) {
      e.preventDefault();
      processAudio(chatApp);
      console.log('button click event');
      return false;
    })

  	socket.on('message', function(message) {
  		var newElement = escapeDivText(message);
  		$("#chat-messages").append(escapeDivText(message.text));
  	});

  	socket.on('nicknameChangeResult', function(result) {
  	  if(result.success){
  	    $("#chat-messages").append(escapeDivText(result.text));
  	  }
  	});

  	socket.on('roomList', function(roomData){
  	  updateRoomList(roomData);
  	});

    socket.on('playAudioSend', function(data){
      audioApp.playCurrentInstrument(data.freq, data.row, data.instrument, data.socketId);
    });

    socket.on('stopAudioSend', function(data){
      audioApp.stopCurrentInstrument(data.row, data.fromMove, data.socketId, data.instrument);
    });

    socket.on('moveCursorSend', function(data){
      // create a cursor for the user if one doesnt exist
      if ($('#cursor-' + username).length === 0){
        $('body').append("\
        <div class='cursor' id='cursor-" + username + "'>\
        <img class='cursor' src='images/music_note.png'/>\
        <h4 id='cursor-nickname'>" + username + " </h4>\
        </div>\
        ");
        console.log("new cursor image")
      }
      $("#cursor-"+ data.nickname).css({ left:data.mouseX, top:data.mouseY });
    });

    socket.on('removeCursor', function(data){
      $("#cursor-"+ data.nickname).remove();
    });
  });
})(this);
