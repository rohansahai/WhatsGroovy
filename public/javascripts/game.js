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
  }
    
})(this);