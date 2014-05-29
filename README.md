# Whats Groovy

Whats Groovy is an online multiplayer audio jam room built using node.js. Communication is via websockets using sockets.io. The inspiration for this application came from Dinahmoe Lab's Plink application. My goal was to recreate a similar application with some of my own touches. 

In summary, each user has an instance of an Audio Context (from the html5 web audio api), and all sounds are connected to the output of this audio context. All the sounds are preloaded via XML requests upon page load so that they can be easily inserted into the audio buffer when triggered.

#### External Libraries

- AudioContextMonkeyPatch.js (https://github.com/cwilso/AudioContext-MonkeyPatch)
- Bootstrap
- EJS