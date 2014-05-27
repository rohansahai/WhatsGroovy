(function(root){


  var ChatApp = root.ChatApp = (root.ChatApp || {});
  var socket = io.connect();

  $(function(){
    window.chatApp = new ChatApp.Chat(socket);

    socket.on('showCurrentRooms', function(rooms) {
      $('#current-rooms').empty();
      for (var i = 0; i < rooms.length; i++) {
        if ($('#current-rooms').children().length < rooms.length){
          $("#current-rooms").append('<li>' + rooms[i] + '</li>');
        }
        //$('#room-name').append("<option value=" + rooms[i] + ">" + rooms[i] + "</option>");
      }
    });


    $('.join-room').submit(function(event){
      event.preventDefault();
      var room = $('#room-name').val();
      var nickname = $('#nickname').val();
      chatApp.enterRoom(room, nickname);
    })

    var gameHtml = new EJS({url: './templates/game.jst.ejs'}).render();
    socket.on('renderHomePage', function(nickname){
      $('body').html(gameHtml);
      startGame(nickname);
    });

    socket.on('renderError', function(data){
      $('.errors').removeClass('hide');
      $('.errors').html('<strong>Warning! </strong>' + data.text);
    });
  })

})(this);
