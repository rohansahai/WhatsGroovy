  var SynthPad = window.SynthPad = function() {
    // Create an audio context.
    myAudioContext = new webkitAudioContext();
  };


  // Play a note.
  SynthPad.playSound = function(freq) {
    console.log('new synth');
    oscillator = myAudioContext.createOscillator();
    gainNode = myAudioContext.createGainNode();
    oscillator.type = 'sine';

    gainNode.connect(myAudioContext.destination);
    oscillator.connect(gainNode);


    oscillator.start(0);
    oscillator.frequency.value = freq;
    gainNode.gain.value = .5;
  };


  // Stop the audio.
  SynthPad.stopSound = function() {
    oscillator.stop(0);
  };

  // Update the note frequency.
  SynthPad.updateFrequency = function(freq) {
    oscillator.start(0);
    oscillator.frequency.value = freq;
  };
