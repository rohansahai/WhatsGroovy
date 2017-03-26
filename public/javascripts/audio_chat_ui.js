(function(root){
  var AudioApp = root.AudioApp = (root.AudioApp || {});
  var socket = io.connect();

  var cursors = AudioApp.cursors = {};

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
      updateMousePosition(data);
    });

    socket.on('removeCursor', function(data){
      delete cursors[data.nickname];
    });
  });

  window.fire = function(){
    cursors["bot"] = new AudioApp.CanvasCursor("bot");
    var recording = [{"mouseX":0.6807228915662651,"mouseY":0.8481848184818482},{"mouseX":0.677710843373494,"mouseY":0.8613861386138614},{"mouseX":0.6746987951807228,"mouseY":0.8696369636963697},{"mouseX":0.6731927710843374,"mouseY":0.8795379537953796},{"mouseX":0.6671686746987951,"mouseY":0.9042904290429042},{"mouseX":0.6641566265060241,"mouseY":0.9158415841584159},{"mouseX":0.6641566265060241,"mouseY":0.9224422442244224},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6626506024096386,"mouseY":0.9042904290429042,"clicked":true},{"mouseX":0.6656626506024096,"mouseY":0.8564356435643564,"clicked":true},{"mouseX":0.6671686746987951,"mouseY":0.8481848184818482,"clicked":true},{"mouseX":0.6671686746987951,"mouseY":0.8481848184818482,"clicked":true},{"mouseX":0.6671686746987951,"mouseY":0.8481848184818482,"clicked":true},{"mouseX":0.6671686746987951,"mouseY":0.8481848184818482,"clicked":true},{"mouseX":0.6671686746987951,"mouseY":0.8481848184818482,"clicked":true},{"mouseX":0.6671686746987951,"mouseY":0.8547854785478548,"clicked":true},{"mouseX":0.6686746987951807,"mouseY":0.8861386138613861,"clicked":true},{"mouseX":0.6686746987951807,"mouseY":0.9141914191419142,"clicked":true},{"mouseX":0.6686746987951807,"mouseY":0.929042904290429,"clicked":true},{"mouseX":0.6686746987951807,"mouseY":0.9372937293729373,"clicked":true},{"mouseX":0.6701807228915663,"mouseY":0.9372937293729373,"clicked":true},{"mouseX":0.6731927710843374,"mouseY":0.9108910891089109,"clicked":true},{"mouseX":0.6746987951807228,"mouseY":0.858085808580858,"clicked":true},{"mouseX":0.6746987951807228,"mouseY":0.8250825082508251,"clicked":true},{"mouseX":0.6746987951807228,"mouseY":0.8217821782178217,"clicked":true},{"mouseX":0.6746987951807228,"mouseY":0.8085808580858086,"clicked":true},{"mouseX":0.6762048192771084,"mouseY":0.7706270627062707,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.7557755775577558,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.7541254125412541,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.7557755775577558,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.7574257425742574,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.759075907590759,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.759075907590759,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.7541254125412541,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.7227722772277227,"clicked":true},{"mouseX":0.6762048192771084,"mouseY":0.7062706270627063,"clicked":true},{"mouseX":0.6746987951807228,"mouseY":0.7013201320132013,"clicked":true},{"mouseX":0.6746987951807228,"mouseY":0.7013201320132013,"clicked":true},{"mouseX":0.6746987951807228,"mouseY":0.7013201320132013,"clicked":true},{"mouseX":0.6746987951807228,"mouseY":0.7013201320132013,"clicked":true},{"mouseX":0.6716867469879518,"mouseY":0.7475247524752475,"clicked":true},{"mouseX":0.6716867469879518,"mouseY":0.8052805280528053,"clicked":true},{"mouseX":0.6731927710843374,"mouseY":0.8547854785478548,"clicked":true},{"mouseX":0.6731927710843374,"mouseY":0.8795379537953796,"clicked":true},{"mouseX":0.677710843373494,"mouseY":0.9026402640264026,"clicked":true},{"mouseX":0.6807228915662651,"mouseY":0.9141914191419142,"clicked":true},{"mouseX":0.6822289156626506,"mouseY":0.9306930693069307,"clicked":true},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":true},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":true},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":true},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":true},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":false},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":true},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":true},{"mouseX":0.6837349397590361,"mouseY":0.933993399339934,"clicked":true},{"mouseX":0.6837349397590361,"mouseY":0.9257425742574258,"clicked":true},{"mouseX":0.6912650602409639,"mouseY":0.7244224422442245,"clicked":true},{"mouseX":0.7033132530120482,"mouseY":0.6089108910891089,"clicked":true},{"mouseX":0.7168674698795181,"mouseY":0.5445544554455446,"clicked":true},{"mouseX":0.7198795180722891,"mouseY":0.533003300330033,"clicked":true},{"mouseX":0.7198795180722891,"mouseY":0.5363036303630363,"clicked":true},{"mouseX":0.7198795180722891,"mouseY":0.6254125412541254,"clicked":true},{"mouseX":0.7198795180722891,"mouseY":0.7046204620462047,"clicked":true},{"mouseX":0.7213855421686747,"mouseY":0.7442244224422442,"clicked":true},{"mouseX":0.7243975903614458,"mouseY":0.759075907590759,"clicked":true},{"mouseX":0.7289156626506024,"mouseY":0.8151815181518152,"clicked":true},{"mouseX":0.7319277108433735,"mouseY":0.8465346534653465,"clicked":true},{"mouseX":0.7364457831325302,"mouseY":0.8597359735973598,"clicked":true},{"mouseX":0.7364457831325302,"mouseY":0.8597359735973598,"clicked":false},{"mouseX":0.7364457831325302,"mouseY":0.8597359735973598,"clicked":false},{"mouseX":0.7364457831325302,"mouseY":0.8597359735973598,"clicked":false},{"mouseX":0.7364457831325302,"mouseY":0.8597359735973598,"clicked":false},{"mouseX":0.8328313253012049,"mouseY":0.8943894389438944,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false},{"mouseX":0.9683734939759037,"mouseY":0.929042904290429,"clicked":false}];
    var i = 0;
    window.setInterval(function(){
      var rec_data = recording[i];
      rec_data["nickname"] = "bot";
      updateMousePosition(rec_data);
      i = i + 1;
    }, 60);
  }
})(this);
