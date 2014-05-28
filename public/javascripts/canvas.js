(function(root){
  var Canvas = root.Canvas = (root.Canvas || {});

  var CanvasCursor = Canvas.CanvasCursor =  function(nickname) {
    this.nickname = nickname;
		this.instrument;
    this.pos = [0, 0];	
  }
	//We are using #fbb735 #e98931 #eb403b #5c4399 #1f5ea8 #2ab0c5
  var instrumentColors = {
    'wildSynth': "#fbb735",
    'organSynth': "#e98931",
    'triangleWah': "#eb403b",
    'vibraphone': "#5c4399",
    'pluckedSynth': "#1f5ea8",
		'bassSynth': "#2ab0c5"
  };
	
	var backgroundImage = new Image();
  backgroundImage.src = 'images/hangingBlackOrange.jpg';

  CanvasCursor.prototype.drawCursor = function(ctx, clicked){
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], 15, 0, 2*Math.PI);
    ctx.lineWidth="2";
    ctx.strokeStyle="blue";
    if (clicked){
      ctx.fillStyle = "red";
      ctx.fill();
    } else {
      ctx.fillStyle = instrumentColors[this.instrument];
      ctx.fill();
    }

    ctx.stroke();

    ctx.beginPath();
    ctx.font="15px Georgia";
    ctx.fillText(this.nickname, this.pos[0] + 15, this.pos[1]);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
  };

  Canvas.draw = function(ctx, canvasWidth, canvasHeight){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
		ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    //ctx.fillStyle = "#A7DBD8";
    //ctx.fillRect(0,0,canvasWidth,canvasHeight);
    Canvas.drawRows(ctx, canvasWidth, canvasHeight);
  }

  Canvas.drawRows = function(ctx, canvasWidth, canvasHeight){
		var numRows = 11;
    var rowHeight = canvasHeight/numRows;

    for (var i = 0; i < numRows; i++) {
      ctx.beginPath();
      ctx.lineWidth="3";
      ctx.strokeStyle="#F38630";
      ctx.moveTo(0,i*rowHeight);
      ctx.lineTo(canvasWidth,i*rowHeight);
      ctx.stroke();
    }
  };

  Canvas.drawCursors = function(ctx, clickedObj){
    for (var key in cursors){
      if (clickedObj[key] === true){
        cursors[key].drawCursor(ctx, true);
      } else{
        cursors[key].drawCursor(ctx);
      }
    }
  };

  Canvas.drawVisualizer = function(ctx, data, canvasWidth, canvasHeight){
    var rowWidth = canvasWidth/data.length;
    for (var i = 0; i < data.length; i++) {
      var height = data[i];
			ctx.save();
			
      ctx.beginPath();
      ctx.strokeStyle="blue";
			ctx.shadowOffsetX = 5;
			ctx.shadowOffsetY = 5;
			ctx.shadowBlur = 10;
			ctx.shadowColor = "blue";
      ctx.rect(i*rowWidth, canvasHeight - height, rowWidth, height);
      ctx.stroke();
			ctx.closePath();
			ctx.restore();
    }
  };

})(this);
