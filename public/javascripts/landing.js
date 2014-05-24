(function(root){


  var ChatApp = root.ChatApp = (root.ChatApp || {});
  var socket = io.connect();

  $(function(){
    window.chatApp = new ChatApp.Chat(socket);
    $('.join-room').submit(function(event){
      event.preventDefault();
      var room = $('#room-name').val();
      var nickname = $('#nickname').val();
      chatApp.enterRoom(room, nickname);
    })

    socket.on('renderHomePage', function(nickname){
      var gameHtml = new EJS({url: './templates/game.jst.ejs'}).render(nickname);
      $('body').html(gameHtml);
      startGame();
      //startGameUI();
    });
  })

})(this);
