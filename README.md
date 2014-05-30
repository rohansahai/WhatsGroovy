# Whats Groovy

Whats Groovy is an online multiplayer audio jam room built using node.js. Communication is via websockets using sockets.io. The inspiration for this application came from Dinahmoe Lab's Plink application. My goal was to recreate a similar application with some of my own touches. 

#### Short Summary

In summary, each user has an instance of an Audio Context (from the html5 web audio api), and all sounds are connected to the output of this audio context. All the sounds are preloaded via XML requests upon page load so that they can be easily inserted into the audio buffer when triggered.

#### Extended Summary

The meat of this application lies in websockets communication (using sockets.io) and extensive use of the web audio API. I originally created my own server but eventually ended up using some of the node-static module server features (I needed this for byte range requests on audio data).

The websockets listen for a series of different events... most importantly mouse events that determine the type of audio played and when to play it. The audio information doesn't actually get passed around (we would probably need to use binary.js for something like that), but instead just mouse events which determine how the audio is played for the client. 

The web audio API is an incredible built-in library with tons of different audio functionality (https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html). Each client holds an instance of a web audio context... and all sounds are passed through the output of this audio context. Each instrument has it's own play sound function in which different Audio Nodes are connected to the instrument to create different sound effects. The most important ones in this application were gain and panner nodes to keep the sound relatively clean. 

#### External Libraries

- AudioContextMonkeyPatch.js (https://github.com/cwilso/AudioContext-MonkeyPatch)
- Bootstrap
- EJS