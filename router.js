var fs = require('fs');
var path = require('path');
var mime = require('mime');

var serveFile = function(response, absPath){
	console.log("serving file at ", absPath);
	fs.readFile(absPath, function(err, data) {
		if (err) {
			console.log("ERROR LOGGED: ", err);
			serveError(response, 404);
		} else {
			response.writeHead(
				200,
				{"Content-Type": mime.lookup(path.basename(absPath))});
			response.end(data);	
		}
	})
};

var serveError = function(response, errorCode){
  var message;
  if (errorCode === 404){
    //TODO: Serve an actual HTML page for these.
    message = 'Error 404: resource not found.';
  } else {
    message = 'Error: there was a problem.';    
  }
  response.writeHead(errorCode, {"Content-Type": "text/plain"});
  response.write(message);
	response.end();
}

var router = function(request, response){
	var url = request.url;
	console.log("Routing to ", url);
	if (url === "/"){
		serveFile(response, "public/index.html");
	} else {
	  serveFile(response, ("public" + url));
	} // end outer if/else
} // end router function

exports.router = router;