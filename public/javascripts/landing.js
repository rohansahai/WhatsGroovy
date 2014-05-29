(function(root){


  var ChatApp = root.ChatApp = (root.ChatApp || {});
  var socket = io.connect();

  $(function(){
    window.chatApp = new ChatApp.Chat(socket);

    socket.on('showCurrentRooms', function(rooms) {
      $('.room-choices').html("\
			<option value='' selected disabled>Choose A Room!</option>\
		  <option id='new-room'>Create A New Room</option>\
			");

      for (var i = 0; i < rooms.length; i++) {
        if ($('.room-choices').children().length - 2 < rooms.length){
					$('.room-choices').append("<option>" + rooms[i] + "</option>");
        }
      }

    });
		
		$('.room-choices').change(function(event){
			if (event.currentTarget.value === "Create A New Room"){
				$('#name-room-inputs').html("\
	      <input class ='form-control input-lg' id='room-name' type='text' placeholder='Enter Room Name'>\
	      <input class ='form-control input-lg' id='nickname' type='text' placeholder='Enter Nickname'>\
				")
			}
		});

    $('.join-room').submit(function(event){
      event.preventDefault();
      var room = $('#room-name').val();
      var nickname = $('#nickname').val();
      chatApp.enterRoom(room, nickname);
    })
		
		$('#room-list-modal').click(function(){
			$('.rooms-modal').modal('show')
		});

    var gameHtml = new EJS({url: './templates/game.jst.ejs'}).render();
    socket.on('renderHomePage', function(data){
			$('body').css('background-image', 'none');
			$('body').css('overflow', 'hidden');
      $('body').html(gameHtml);
			chatApp.room = data.room;
      startGame(data.nickname);
    });

    socket.on('renderError', function(data){
      $('.errors').removeClass('hide');
      $('.errors').html('<strong>Warning! </strong>' + data.text);
    });
  })

})(this);
