frequencies = {
  1: 130.81,
  2: 146.83,
  3: 164.81,
  4: 174.61,
  5: 196,
  6: 220,
  7: 246.94,
  8: 261.63,
  9: 293.66,
  10: 329.63,
  11: 349.23,
  12: 392,
  13: 440,
  14: 493.88,
  15: 523.25
}

$(function(){
  var canvas = document.getElementById("music");
  canvas.width  = window.innerWidth - 10;
  canvas.height = window.innerHeight - 150;

  window.audioApp = new AudioletApp();
  var currentAudioRow = 0;
  var numRows = 12;

  var context = canvas.getContext("2d");

  var opts = {
    distance : canvas.height/numRows,
    lineWidth : 1,
    gridColor  : "#66ff00",
    caption : false
  };
  new Grid(opts).draw(context);

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
      //audioApp.playCurrentInstrument(frequencies[currentAudioRow], currentAudioRow);
    }
  }, false);

  $('#high-synth-button').click(function(event){

    var $target = $(event.currentTarget);
    if (audioApp.currentInstrument === "high synth"){
      audioApp.currentInstrument = '';
      $target.removeClass("active");
    } else {
      audioApp.currentInstrument = 'high synth';
      $target.addClass("active");
    }
  })

  $('#organ-button').click(function(event){

    var $target = $(event.currentTarget);
    if (audioApp.currentInstrument === 'keys'){
      audioApp.currentInstrument = '';
      $target.removeClass("active");
    } else {
      audioApp.currentInstrument = 'keys';
      $target.addClass("active");
    }
  })

  $('#kick-button').click(function(event){
    var $target = $(event.currentTarget);
    if ($target.html() === "Kick ON"){
      audioApp.playKick();
      $target.html("Kick OFF")
      $target.addClass("active")
    } else {
      audioApp.stopInstrument(audioApp.kickEvent);
      $target.html("Kick ON")
      $target.removeClass("active")
    }
  })

  $('#shaker-button').click(function(){
    var $target = $(event.currentTarget);
    if ($target.html() === "Shaker ON"){
      audioApp.playShaker();
      $target.html("Shaker OFF")
      $target.addClass("active")
    } else {
      audioApp.stopInstrument(audioApp.shakerEvent);
      $target.html("Shaker ON")
      $target.removeClass("active")
    }
  })

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
    audioApp.playCurrentInstrument(frequencies[currentAudioRow], currentAudioRow);
    // May want to keep above comment so your own audio is heard immediately.
    chatApp.sendAudio(frequencies[currentAudioRow], currentAudioRow, audioApp.currentInstrument);
  }

  function stopAudio(fromMove) {
    audioApp.stopCurrentInstrument(audioApp.highSynthEvents[0], currentAudioRow, fromMove, 0);
    chatApp.stopAudio(audioApp.highSynthEvent, currentAudioRow, fromMove);
  }
})
