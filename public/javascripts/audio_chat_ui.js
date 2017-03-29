(function(root){
  var AudioApp = root.AudioApp = (root.AudioApp || {});
  var socket = io.connect();

  var cursors = AudioApp.cursors = {};

  var escapeDivText = function(text) {
  	return $("<div></div>").text(text);
  }

  $(document).ready(function() {
    socket.on('playAudioSend', function(data){
      AudioApp.audioApp.playCurrentInstrument(data.row, data.instrument, data.nickname);
    });

    socket.on('stopAudioSend', function(data){
      AudioApp.audioApp.stopCurrentInstrument(data.row, data.fromMove, data.nickname, data.instrument);
    });

    socket.on('moveCursorSend', function(data){
      // create a cursor for the user if one doesnt exist
      if (!cursors[data.nickname]){
        cursors[data.nickname] = new AudioApp.CanvasCursor(data.nickname);
      }
      AudioApp.updateMousePosition(data);
    });

    socket.on('removeCursor', function(data){
      delete cursors[data.nickname];
    });

    socket.on('botOff', function(data){
      delete cursors[data.nickname];
      AudioApp.audioApp.stopCurrentInstrument(data.row, false, data.nickname, data.instrument);
    })
  });
})(this);
