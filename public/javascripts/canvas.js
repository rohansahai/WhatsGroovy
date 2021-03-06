(function(root){
  var AudioApp = root.AudioApp = (root.AudioApp || {});

  var CanvasCursor = AudioApp.CanvasCursor =  function(nickname) {
    this.nickname = nickname;
		this.instrument;
    this.pos = [0, 0];	
  }
	//We are using #fbb735 #e98931 #eb403b #5c4399 #1f5ea8 #2ab0c5 #39c0b3
  var instrumentColors = {
    'wildSynth': "#fbb735",
    'organSynth': "#e98931",
    'triangleWah': "#eb403b",
    'marimba': "#5c4399",
    'pluckedSynth': "#1f5ea8",
		'bassSynth': "#2ab0c5",
		'harpChord': "#39c0b3"
  };
	
	/*#fbb735 #e98931 #eb403b #b32e37 #6c2a6a #5c4399
	#274389 #1f5ea8 #227fb0 #2ab0c5 #39c0b3*/
  var visualizerColors = {
    0: "#fbb735",
    1: "#e98931",
		2: "#eb403b",
		3: "#b32e37",
		4: "#6c2a6a",
    5: "#5c4399",
		6: "#274389",
    7: "#1f5ea8",
		8: "#227fb0",
		9: "#2ab0c5",
		10: "#39c0b3"
  };
	
	var logoImage = new Image();
	logoImage.src = 'images/logoWhite.png'

  CanvasCursor.prototype.drawCursor = function(ctx, clicked, data){
    ctx.beginPath();
		if (data){
			var middle = data[Math.floor(data.length/2)];
			var scaleMax = 30;
			var scaleMin = 15;
			var valueMax = 200;
			var valueMin = 0;
			
			var radius = (((scaleMax - scaleMin)*(middle - valueMin))/(valueMax - valueMin)) + scaleMin;
			if (radius < 15){ radius = 15 };
			if (radius > 30){ radius = 30 };
			ctx.arc(this.pos[0], this.pos[1], radius, 0, 2*Math.PI);
		} else {
			ctx.arc(this.pos[0], this.pos[1], 15, 0, 2*Math.PI);
		}
    ctx.lineWidth="2";
    ctx.strokeStyle=instrumentColors[this.instrument];
    if (clicked){
      ctx.fillStyle = "red";
      ctx.fill();
    } else {
      ctx.fillStyle = 'transparent';
      ctx.fill();
    }

    ctx.stroke();
		
    ctx.beginPath();
    ctx.font="15pt Arial";
		ctx.fillStyle = "white";
    ctx.fillText(this.nickname, this.pos[0] + 15, this.pos[1]);
    
    ctx.fill();
    ctx.stroke();
  };

  AudioApp.drawCanvas = function(ctx, canvasWidth, canvasHeight){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
		AudioApp.drawLogo(ctx, canvasWidth, canvasHeight);
    AudioApp.drawRows(ctx, canvasWidth, canvasHeight);
  }
	
	AudioApp.drawLogo = function(ctx, canvasWidth, canvasHeight){
		//image is 356 x 199
		ctx.drawImage(logoImage, canvasWidth/2 -356/2, canvasHeight/2 - 199/2);
	};

  AudioApp.drawRows = function(ctx, canvasWidth, canvasHeight){
		var numRows = 11;
    var rowHeight = canvasHeight/numRows;

    for (var i = 0; i < numRows; i++) {
      ctx.beginPath();
      ctx.lineWidth="3";
      ctx.strokeStyle="white";
      ctx.moveTo(0,i*rowHeight);
      ctx.lineTo(canvasWidth,i*rowHeight);
      ctx.stroke();
    }
  };

  AudioApp.drawCursors = function(ctx, clickedObj, data){
    for (var key in AudioApp.cursors){
      if (clickedObj[key] === true){
        AudioApp.cursors[key].drawCursor(ctx, true, data);
      } else{
        AudioApp.cursors[key].drawCursor(ctx);
      }
    }
  };

  AudioApp.drawVisualizer = function(ctx, data, canvasWidth, canvasHeight){
    var rowWidth = canvasWidth/data.length;
		var numColors = Object.keys(visualizerColors).length;
    for (var i = 0; i < data.length/numColors; i++) {
			for(var j = 0; j < numColors; j++){
	      var height = data[j+i*numColors];
				ctx.save();
			
	      ctx.beginPath();
	      ctx.strokeStyle= visualizerColors[j];
				ctx.shadowOffsetX = 5;
				ctx.shadowOffsetY = 5;
				ctx.shadowBlur = 10;
				ctx.shadowColor = visualizerColors[j];
	      ctx.rect((j+i*numColors)*rowWidth, canvasHeight - height, rowWidth, height);
	      ctx.stroke();
				ctx.closePath();
				ctx.restore();
			}
		}

    AudioApp.updateMousePosition = function(data) {
      //data.mouseX and mouseY are ratios of mouse position relative to canvas
      //size of other user
      var canvasWidth = $('#music').width();
      var canvasHeight = $('#music').height();

      AudioApp.cursors[data.nickname].pos = [(data.mouseX * canvasWidth), (data.mouseY * canvasHeight)];
    }
  };

})(this);
