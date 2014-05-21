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
  	var chatApp = new ChatApp.Chat(socket);

    document.onmousemove = function (e) {
      mouseX = e.pageX;
      mouseY = e.pageY;
      chatApp.sendMouseCoords(mouseX, mouseY);
      //$("#cursor").css({left:e.pageX, top:e.pageY});
    }

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
  	  console.log(roomData);
  	  updateRoomList(roomData);
  	});

    socket.on('playAudioSend', function(){
      console.log("received audio send from server");
      playExample()
    });

    socket.on('moveCursorSend', function(data){
      $("#cursor-"+ data.guest).css({ left:data.mouseX, top:data.mouseY });
    });

    socket.on('newCursor', function(data){
      $('body').append("<img class='cursor' id='cursor-" + data.guest + "'src='images/music_note.png'/>")
    })

  	$('.send-form').submit(function(e) {
  		e.preventDefault();
  		processInput(chatApp);
  		return false;
  	});

    $('#play').click(function(e) {
      e.preventDefault();
      processAudio(chatApp);
      return false;
    })
  });
})(this);
