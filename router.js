var fs = require('fs');
var path = require('path');
var mime = require('mime');
var static = require('node-static');
var fileServer = new static.Server('./public', { cache: 3600 } );

var router = function(request, response){
	var url = request.url;
	console.log("Routing to ", url);
	if (url === "/"){
		fileServer.serve(request, response);
	} else {
		fileServer.serve(request, response);
	} 
} 

exports.router = router;
