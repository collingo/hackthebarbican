var http = require("http"),
		path = require("path"),
		url = require("url"),
		fs = require("fs");

http.createServer(function(request, response) {
	var req_path = url.parse(request.url).pathname,
			full_path;

	switch(req_path) {

	case "/":
		response.writeHeader(200, {"Content-Type": "text/plain"});
		response.write(Date.now()+"");
		response.end();
		break;

	case "/favicon.ico":
		// ignore favicon request
		console.log("Ignored favicon request");
		break;

	default:
		full_path = path.join(process.cwd(), req_path);
		fs.exists(full_path, function(exists) {
			if(!exists) {
				response.writeHeader(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
			}	else {
				fs.readFile(full_path, "binary", function(err, file) {
					if(err) {
						response.writeHeader(500, {"Content-Type": "text/plain"});
						response.write(err + "\n");
						response.end();
					} else {
						response.writeHeader(200);
						response.write(file, "binary");
						response.end();
					}
				});
			}
		});
	}

}).listen(process.env.VMC_APP_PORT || 1337, null);