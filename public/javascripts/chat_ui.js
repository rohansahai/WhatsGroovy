(function(root){
  var ChatApp = root.ChatApp = (root.ChatApp || {});
  var socket = io.connect();

  window.cursors = {};

  var escapeDivText = function(text) {
  	return $("<div></div>").text(text);
  }

  var updateMousePosition = function(data) {
    //data.mouseX and mouseY are ratios of mouse position relative to canvas
    //size of other user
    var canvasWidth = $('#music').width();
    var canvasHeight = $('#music').height();

    cursors[data.nickname].pos = [(data.mouseX * canvasWidth), (data.mouseY * canvasHeight)];
  }

  $(document).ready(function() {
  	window.chatApp = new ChatApp.Chat(socket);

    socket.on('playAudioSend', function(data){
      console.log('received audio from server');
      audioApp.playCurrentInstrument(data.row, data.instrument, data.socketId);
    });

    socket.on('stopAudioSend', function(data){
      audioApp.stopCurrentInstrument(data.row, data.fromMove, data.socketId, data.instrument);
    });

    socket.on('moveCursorSend', function(data){
      // create a cursor for the user if one doesnt exist
      if (!cursors[data.nickname]){
        cursors[data.nickname] = new Canvas.CanvasCursor(data.nickname);
      }
      updateMousePosition(data);
    });

    socket.on('removeCursor', function(data){
      delete cursors[data.nickname];
    });
  });
})(this);
