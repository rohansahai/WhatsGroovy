(function(root){
  var Canvas = root.Canvas = (root.Canvas || {});

  var CanvasCursor = Canvas.CanvasCursor =  function(nickname) {
    this.nickname = nickname;
    this.pos = [0, 0];
  }

  CanvasCursor.prototype.drawCursor = function(ctx){
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], 15, 0, 2*Math.PI);
    ctx.lineWidth="1";
    ctx.strokeStyle="black";
    ctx.fillStyle = "red";
    ctx.fill();
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
    ctx.fillStyle = "blue";
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    Canvas.drawRows(ctx, canvasWidth, canvasHeight);
  }

  Canvas.drawRows = function(ctx, canvasWidth, canvasHeight){
    var rowHeight = canvasHeight/10;

    for (var i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.lineWidth="5";
      ctx.strokeStyle="green";
      ctx.moveTo(0,i*rowHeight);
      ctx.lineTo(canvasWidth,i*rowHeight);
      ctx.stroke();
    }
  };

  Canvas.drawCursors = function(ctx){

    for (var key in cursors){
      cursors[key].drawCursor(ctx);
    }
  };

})(this);
