(function(root){
  var ChatApp = root.ChatApp = (root.ChatApp || {});
  var socket = io.connect();

  $(function(){
    window.chatApp = new ChatApp.Chat(socket);
    $('#join-room').submit(function(){
      chatApp.enterRoom();
    })

    socket.on('renderHomePage', function(){
      $('body').html(
        "<header>
          <h1>Audio Sockets Testing</h1>
        </header>

        <div class='btn-group'>
          <button type='button' id='high-synth-button' class='btn btn-primary'>High Synth</button>
          <button type='button' id='organ-button' class='btn btn-warning'>Organ</button>
          <button type='button' id='kick-button' class='btn btn-danger'>Kick OFF</button>
          <button type='button' id='shaker-button' class='btn btn-success'>Shaker OFF</button>
          <button type='button' id='wild-synth-button' class='btn btn-default'>Wild Synth</button>
          <button type='button' id='gated-edm-button' class='btn btn-default'>Gated EDM</button>
          <button type='button' id='bass-synth-button' class='btn btn-default'>Bass Synth</button>
        </div>

        <h1 class='text-center'>
          Whats Groovy?
        </h1>

        <canvas id='music'>
        </canvas>

        <div id='chat-messages'>
        </div>

        <form class='send-form'>
          <input id='send-message' type='text'>
          <input id='send-button' type='submit' value='Send'>
        </form>
        <div class='room-listings'>
        </div>

        <img class='cursor' id='my-cursor' src='images/music_note.png'/>"
      )
      startGame();
    });
  })

})(this);
