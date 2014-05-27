window.startGame = function startGame(nickname){
  $('body').css('background-color', 'white')
  var canvas = document.getElementById("music");
  canvas.width  = window.innerWidth - 150;
  canvas.height = window.innerHeight - 150;

  cursors[nickname] = new Canvas.CanvasCursor(nickname);

  window.audioApp = new AudioApp();
  var currentAudioRow = 0;
  var numRows = 10;
  var ctx = canvas.getContext("2d");

  setInterval(function(){
    audioApp.updateAnalyser();
    Canvas.draw(ctx, canvas.width, canvas.height);
    Canvas.drawCursors(ctx, audioApp.clicked);
    Canvas.drawVisualizer(ctx, audioApp.frequencyData, canvas.width, canvas.height);
  }, 10);

  setUpMouseEvents();

  var instrumentNames = ['triangleWah', 'vibraphone', 'pluckedSynth',
                     'wildSynth', 'organSynth'];
  setUpButtonEvents(instrumentNames);

  function setUpMouseEvents(){
    canvas.addEventListener('mousedown', function(evt) {
      var mousePos = getMousePos(canvas, evt);
      var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      playAudio(mousePos.y);
    }, false);

    canvas.addEventListener('mouseup', function(evt) {
      stopAudio();
      currentAudioRow = 0;
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
      chatApp.sendMouseCoords(evt.offsetX/canvasWidth, evt.offsetY/canvasHeight);
      $("#my-cursor").css({left:evt.pageX, top:evt.pageY});

      cursors[nickname].pos[0] = evt.offsetX;
      cursors[nickname].pos[1] = evt.offsetY;

    }, false);
  }

  function setUpButtonEvents(instruments){
    for (var i = 0; i < instruments.length; i++) {
      (function(i){
        $('#' + instruments[i] + '-button').click(function(event){
          var $target = $(event.currentTarget);
          if (audioApp.currentInstrument === instruments[i]){
            audioApp.currentInstrument = '';
            $target.removeClass("active");
          } else {
            audioApp.currentInstrument = instruments[i];
            $target.addClass("active");
          }
        })
      })(i);
    }
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
    chatApp.sendAudio(currentAudioRow, audioApp.currentInstrument);
  }

  function stopAudio(fromMove) {
    audioApp.stopCurrentInstrument(currentAudioRow, fromMove, nickname, audioApp.currentInstrument);
    chatApp.stopAudio(currentAudioRow, fromMove, audioApp.currentInstrument);
  }
}
