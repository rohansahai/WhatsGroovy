(function(root){
  var AudioApp = root.AudioApp = (root.AudioApp || {});

  AudioApp.startGame = function startGame(nickname){
      //set up design 
    $('body').css('background-color', 'white');
    $('.modal-loading').modal('show');
    var canvas = document.getElementById("music");
    canvas.width  = window.innerWidth - 150;
    canvas.height = window.innerHeight - 170;
    var instrumentNames = ['triangleWah', 'marimba', 'pluckedSynth',
                       'wildSynth', 'organSynth', 'bassSynth', 'harpChord'];

      
    AudioApp.cursors[nickname] = new AudioApp.CanvasCursor(nickname);
    var audioApp = AudioApp.audioApp = new AudioApp.MasterAudio();
      audioApp.currentInstrument = 'organSynth'; //default to organ, randomize?
    var currentAudioRow = 0;
    var numRows = 11;
    var ctx = canvas.getContext("2d");

    window.recording = [];
    setInterval(function(){
      audioApp.updateAnalyser();
      AudioApp.drawCanvas(ctx, canvas.width, canvas.height);
      AudioApp.drawCursors(ctx, audioApp.clicked, audioApp.frequencyData);
      AudioApp.drawVisualizer(ctx, audioApp.frequencyData, canvas.width, canvas.height);
      recording.push({"mouseX": window.mouseX, "mouseY": window.mouseY, "clicked": window.clicked, "row": currentAudioRow, "instrument": audioApp.currentInstrument});
    }, 60);

    setUpMouseEvents();
    setButtonState();
    setUpButtonEvents(instrumentNames);
      
    function setUpMouseEvents(){
      canvas.addEventListener('mousedown', function(evt) {
        evt.preventDefault();
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        playAudio(mousePos.y);
        window.clicked = true;
      }, false);

      canvas.addEventListener('mouseup', function(evt) {
        stopAudio();
        currentAudioRow = 0;
        window.clicked = false;
      }, false);

      canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var row = getRow(mousePos.y);
        if (currentAudioRow !== 0 && row !== currentAudioRow){
          stopAudio(true);
          playAudio(mousePos.y)
        }

        var canvasWidth = $('#music').width();
        var canvasHeight = $('#music').height();

        window.mouseX = evt.offsetX/canvasWidth;
        window.mouseY = evt.offsetY/canvasHeight;
        AudioApp.audioChat.sendMouseCoords(evt.offsetX/canvasWidth, evt.offsetY/canvasHeight);
        $("#my-cursor").css({left:evt.pageX, top:evt.pageY});

        AudioApp.cursors[nickname].pos[0] = evt.offsetX;
        AudioApp.cursors[nickname].pos[1] = evt.offsetY;

      }, false);
      
          canvas.addEventListener('mouseleave', function(){
              clearInterval(audioApp.intervals[nickname]);
              audioApp.clicked[nickname] = false;
              currentAudioRow = 0;
              audioApp.instrumentObjects[audioApp.currentInstrument][nickname].playing = false;
              stopAudio();
              // get rids of bug where music continues to play when mouse leaves
          });
      
          canvas.addEventListener('dblclick', function(evt){ 
              evt.preventDefault();
          });
      
          canvas.addEventListener("touchstart", touchHandler, true);
          canvas.addEventListener("touchmove", touchHandler, true);
          canvas.addEventListener("touchend", touchHandler, true);
          canvas.addEventListener("touchcancel", touchHandler, true); 
      
          $('#footer a').click(function(){
              $('.modal-about').modal('show')
          });
    }

    function setUpButtonEvents(instruments){

      for (var i = 0; i < instruments.length; i++) {
        (function(i){
          $('#' + instruments[i] + '-button').click(function(event){
                  
            var $target = $(event.currentTarget);
            if (!(audioApp.currentInstrument === instruments[i])){
              $('#' + audioApp.currentInstrument + '-button').removeClass("selected-button");
              audioApp.currentInstrument = instruments[i];
              setButtonState();
            }
                  
            AudioApp.cursors[nickname].instrument = audioApp.currentInstrument;
                  
          })
        })(i);
      }
    }
  
      // from http://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events
      function touchHandler(event)
      {
          var touches = event.changedTouches,
              first = touches[0],
              type = "";
               switch(event.type)
          {
              case "touchstart": type = "mousedown"; break;
              case "touchmove":  type="mousemove"; break;        
              case "touchend":   type="mouseup"; break;
              default: return;
          }

                   //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
          //           screenX, screenY, clientX, clientY, ctrlKey, 
          //           altKey, shiftKey, metaKey, button, relatedTarget);

          var simulatedEvent = document.createEvent("MouseEvent");
          simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                    first.screenX, first.screenY, 
                                    first.clientX, first.clientY, false, 
                                    false, false, false, 0/*left*/, null);

                                                                                       first.target.dispatchEvent(simulatedEvent);
          event.preventDefault();
      }

    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    function getRow(mousePosY) {
      for (var i = 1; i < numRows + 1; i++) {
        if (mousePosY < i*canvas.height/numRows){
          return i;
        }
      }
    }

    function playAudio(mousePosY) {
      currentAudioRow = getRow(mousePosY);
      audioApp.playCurrentInstrument(currentAudioRow, audioApp.currentInstrument, nickname);
      AudioApp.audioChat.sendAudio(currentAudioRow, audioApp.currentInstrument);
    }

    function stopAudio(fromMove) {
      audioApp.stopCurrentInstrument(currentAudioRow, fromMove, nickname, audioApp.currentInstrument);
      AudioApp.audioChat.stopAudio(currentAudioRow, fromMove, audioApp.currentInstrument);
    }
  
    function setButtonState(){
        $('#' + audioApp.currentInstrument + '-button').addClass("selected-button");
    }

    function playBot(){
      AudioApp.cursors["bot"] = new AudioApp.CanvasCursor("bot");
      var recording = [{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9653465346534653,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7319277108433735,"mouseY":0.9636963696369637,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.733433734939759,"mouseY":0.9603960396039604,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.733433734939759,"mouseY":0.9603960396039604,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.733433734939759,"mouseY":0.9603960396039604,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.733433734939759,"mouseY":0.9603960396039604,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.733433734939759,"mouseY":0.9603960396039604,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.733433734939759,"mouseY":0.9603960396039604,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7364457831325302,"mouseY":0.9455445544554455,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7530120481927711,"mouseY":0.8910891089108911,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.8729372937293729,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.8696369636963697,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.8696369636963697,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.8696369636963697,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.8696369636963697,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.8679867986798679,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.8498349834983498,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.8135313531353136,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7575301204819277,"mouseY":0.7788778877887789,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7605421686746988,"mouseY":0.7706270627062707,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.766566265060241,"mouseY":0.7557755775577558,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.766566265060241,"mouseY":0.7541254125412541,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7680722891566265,"mouseY":0.7508250825082509,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7695783132530121,"mouseY":0.7508250825082509,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7695783132530121,"mouseY":0.7508250825082509,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7695783132530121,"mouseY":0.7508250825082509,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7695783132530121,"mouseY":0.7277227722772277,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7695783132530121,"mouseY":0.7029702970297029,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7710843373493976,"mouseY":0.7013201320132013,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7710843373493976,"mouseY":0.6996699669966997,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7725903614457831,"mouseY":0.6996699669966997,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7725903614457831,"mouseY":0.6996699669966997,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.7725903614457831,"mouseY":0.7029702970297029,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.7725903614457831,"mouseY":0.735973597359736,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7725903614457831,"mouseY":0.7838283828382838,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7725903614457831,"mouseY":0.8102310231023102,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7725903614457831,"mouseY":0.8184818481848185,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7725903614457831,"mouseY":0.8399339933993399,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7695783132530121,"mouseY":0.858085808580858,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7680722891566265,"mouseY":0.8745874587458746,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7650602409638554,"mouseY":0.8877887788778878,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7605421686746988,"mouseY":0.9108910891089109,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7575301204819277,"mouseY":0.9273927392739274,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7575301204819277,"mouseY":0.9306930693069307,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7575301204819277,"mouseY":0.9323432343234324,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.9356435643564357,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.9356435643564357,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.9356435643564357,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.9356435643564357,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.9356435643564357,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7560240963855421,"mouseY":0.9273927392739274,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.766566265060241,"mouseY":0.7607260726072608,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7966867469879518,"mouseY":0.504950495049505,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8012048192771084,"mouseY":0.44554455445544555,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8042168674698795,"mouseY":0.38613861386138615,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.36468646864686466,"clicked":true,"row":5,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.37293729372937295,"clicked":true,"row":5,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.45544554455445546,"clicked":true,"row":6,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.49834983498349833,"clicked":true,"row":6,"instrument":"organSynth"},{"mouseX":0.8057228915662651,"mouseY":0.5214521452145214,"clicked":true,"row":6,"instrument":"organSynth"},{"mouseX":0.8192771084337349,"mouseY":0.4636963696369637,"clicked":true,"row":6,"instrument":"organSynth"},{"mouseX":0.8403614457831325,"mouseY":0.38943894389438943,"clicked":true,"row":5,"instrument":"organSynth"},{"mouseX":0.8433734939759037,"mouseY":0.3795379537953795,"clicked":true,"row":5,"instrument":"organSynth"},{"mouseX":0.838855421686747,"mouseY":0.5528052805280528,"clicked":true,"row":7,"instrument":"organSynth"},{"mouseX":0.8298192771084337,"mouseY":0.6303630363036303,"clicked":true,"row":7,"instrument":"organSynth"},{"mouseX":0.8268072289156626,"mouseY":0.6584158415841584,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.8268072289156626,"mouseY":0.6617161716171617,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.8644578313253012,"mouseY":0.5396039603960396,"clicked":true,"row":6,"instrument":"organSynth"},{"mouseX":0.8960843373493976,"mouseY":0.47194719471947194,"clicked":true,"row":6,"instrument":"organSynth"},{"mouseX":0.9021084337349398,"mouseY":0.48514851485148514,"clicked":true,"row":6,"instrument":"organSynth"},{"mouseX":0.8900602409638554,"mouseY":0.6386138613861386,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.8659638554216867,"mouseY":0.7244224422442245,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.8614457831325302,"mouseY":0.731023102310231,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.8855421686746988,"mouseY":0.6105610561056105,"clicked":true,"row":7,"instrument":"organSynth"},{"mouseX":0.911144578313253,"mouseY":0.39603960396039606,"clicked":true,"row":5,"instrument":"organSynth"},{"mouseX":0.9126506024096386,"mouseY":0.2508250825082508,"clicked":true,"row":3,"instrument":"organSynth"},{"mouseX":0.911144578313253,"mouseY":0.22112211221122113,"clicked":true,"row":3,"instrument":"organSynth"},{"mouseX":0.9066265060240963,"mouseY":0.15676567656765678,"clicked":true,"row":2,"instrument":"organSynth"},{"mouseX":0.9036144578313253,"mouseY":0.14026402640264027,"clicked":true,"row":2,"instrument":"organSynth"},{"mouseX":0.8975903614457831,"mouseY":0.15676567656765678,"clicked":true,"row":2,"instrument":"organSynth"},{"mouseX":0.8283132530120482,"mouseY":0.4471947194719472,"clicked":true,"row":5,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.599009900990099,"clicked":true,"row":7,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.6567656765676567,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.6914191419141914,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7145214521452146,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7392739273927392,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7574257425742574,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7739273927392739,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.806930693069307,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7921686746987951,"mouseY":0.8531353135313532,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7891566265060241,"mouseY":0.8811881188118812,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7891566265060241,"mouseY":0.8943894389438944,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7876506024096386,"mouseY":0.9042904290429042,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7876506024096386,"mouseY":0.9092409240924092,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7846385542168675,"mouseY":0.9141914191419142,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7831325301204819,"mouseY":0.9207920792079208,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7831325301204819,"mouseY":0.9257425742574258,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.9306930693069307,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.8927392739273927,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7801204819277109,"mouseY":0.8498349834983498,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.786144578313253,"mouseY":0.8415841584158416,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.8333333333333334,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7920792079207921,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7755775577557755,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7951807228915663,"mouseY":0.7739273927392739,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.7981927710843374,"mouseY":0.7194719471947195,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6782178217821783,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6765676567656765,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6765676567656765,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6765676567656765,"clicked":true,"row":8,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6765676567656765,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6765676567656765,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6765676567656765,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6765676567656765,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.802710843373494,"mouseY":0.6732673267326733,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8177710843373494,"mouseY":0.5957095709570958,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8298192771084337,"mouseY":0.5379537953795379,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8313253012048193,"mouseY":0.5379537953795379,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8313253012048193,"mouseY":0.5396039603960396,"clicked":false,"row":0,"instrument":"organSynth"},{"mouseX":0.8313253012048193,"mouseY":0.5462046204620462,"clicked":true,"row":7,"instrument":"organSynth"},{"mouseX":0.8313253012048193,"mouseY":0.6254125412541254,"clicked":true,"row":7,"instrument":"organSynth"},{"mouseX":0.8313253012048193,"mouseY":0.759075907590759,"clicked":true,"row":9,"instrument":"organSynth"},{"mouseX":0.8343373493975904,"mouseY":0.9026402640264026,"clicked":true,"row":10,"instrument":"organSynth"},{"mouseX":0.8403614457831325,"mouseY":0.9735973597359736,"clicked":true,"row":11,"instrument":"organSynth"},{"mouseX":0.8418674698795181,"mouseY":0.9933993399339934,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.8418674698795181,"mouseY":0.9933993399339934,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.8418674698795181,"mouseY":0.9933993399339934,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.8418674698795181,"mouseY":0.9933993399339934,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.8418674698795181,"mouseY":0.9933993399339934,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.8418674698795181,"mouseY":0.9933993399339934,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.8418674698795181,"mouseY":0.9933993399339934,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.8418674698795181,"mouseY":0.9933993399339934,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"},{"mouseX":0.963855421686747,"mouseY":0.9867986798679867,"clicked":true,"row":0,"instrument":"organSynth"}];
      var i = 0;
      var last_audio_row;
      window.setInterval(function(){
        var rec_data = recording[i];
        rec_data["nickname"] = "bot";
        AudioApp.updateMousePosition(rec_data);
        if (rec_data["clicked"] && rec_data["row"] > 0) {
          if (last_audio_row === rec_data["row"]) {
            AudioApp.audioApp.stopCurrentInstrument(rec_data["row"], true, "bot", rec_data["instrument"]);
          }
          AudioApp.audioApp.playCurrentInstrument(rec_data["row"], rec_data["instrument"], "bot");
          last_audio_row = rec_data["row"];
        } else {
          AudioApp.audioApp.stopCurrentInstrument(rec_data["row"], false, "bot", rec_data["instrument"]);
        }
        i = i + 1;
        if (i > recording.length - 1) {
          i = 0;
        }
      }, 60);
    }
  }
    
})(this);