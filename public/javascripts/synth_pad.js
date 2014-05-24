var SynthPad = window.SynthPad = function() {
    // Create an audio context.
    myAudioContext = new webkitAudioContext();
  };

  // Event Listeners
  SynthPad.setupEventListeners = function() {

    // Disables scrolling on touch devices.
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);

    myCanvas.addEventListener('mousedown', SynthPad.playSound);
    myCanvas.addEventListener('touchstart', SynthPad.playSound);

    myCanvas.addEventListener('mouseup', SynthPad.stopSound);
    document.addEventListener('mouseleave', SynthPad.stopSound);
    myCanvas.addEventListener('touchend', SynthPad.stopSound);
  };


  // Play a note.
  SynthPad.playSound = function(freq) {
    oscillator = myAudioContext.createOscillator();

    oscillator.type = 'triangle';

    oscillator.connect(myAudioContext.destination);

    oscillator.start(0);
    oscillator.frequency.value = freq;

    // myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
    // myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);
    //
    // myCanvas.addEventListener('mouseout', SynthPad.stopSound);
  };


  // Stop the audio.
  SynthPad.stopSound = function(event) {
    oscillator.stop(0);

    myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
  };

  // Fetch the new frequency and volume.
  SynthPad.calculateFrequency = function(x, y) {
    var noteValue = SynthPad.calculateNote(x);
    var volumeValue = SynthPad.calculateVolume(y);

    oscillator.frequency.value = noteValue;
    gainNode.gain.value = volumeValue;

    frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
    volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
  };


  // Update the note frequency.
  SynthPad.updateFrequency = function(freq) {
    oscillator.frequency.value = freq;
    // if (event.type == 'mousedown' || event.type == 'mousemove') {
    //   SynthPad.calculateFrequency(event.x, event.y);
    // } else if (event.type == 'touchstart' || event.type == 'touchmove') {
    //   var touch = event.touches[0];
    //   SynthPad.calculateFrequency(touch.pageX, touch.pageY);
    // }
  };
