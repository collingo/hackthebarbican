var http = require("http"),
		path = require("path"),
		url = require("url"),
		fs = require("fs"),
		moment = require("moment");

function twoDigitNumber(num) {
	return ("0" + num).slice(-2);
}

http.createServer(function(request, response) {
	var req_path = url.parse(request.url).pathname,
			full_path,
			stat,
			readStream,
			time,
			hour,
			minute,
			assetBaseUrl,
			responseValue;

	switch(req_path) {

	case "/time":
		time = moment();
		hour = twoDigitNumber(time.hour());
		minute = twoDigitNumber(time.minute());
		assetBaseUrl = "/assets/"+hour+minute;
		// assetBaseUrl = "/assets/1959";

		fs.exists(path.join(process.cwd(), assetBaseUrl), function(exists) {
			var responseValue = hour+":"+minute;
			if(exists) {
				var content = require(path.join(process.cwd(), assetBaseUrl, "/content.json"));
				responseValue = (content.glitchDate || hour+":"+minute) + "|"+assetBaseUrl+"/audio.mp3|"+assetBaseUrl+"/image.jpg|"+assetBaseUrl+"/content.json";
			}
			response.writeHeader(200, {"Content-Type": "text/plain"});
			response.write(responseValue);
			response.end();
		});

		break;

	case "/assets":
		time = moment();
		hour = twoDigitNumber(time.hour());
		minute = twoDigitNumber(time.minute());
		assetBaseUrl = "/assets/"+hour+minute;

		fs.exists(path.join(process.cwd(), assetBaseUrl), function(exists) {
			var responseValue = hour+":"+minute;
			if(exists) {
				responseValue += "|"+assetBaseUrl+"/audio.mp3";
			}
			response.writeHeader(200, {"Content-Type": "text/plain"});
			response.write(responseValue);
			response.end();
		});

		break;

	case "/favicon.ico":
		// ignore favicon request
		console.log("Ignored favicon request");
		break;

	default:
		var baseFilePath = "/www";
		if(req_path.split('/')[1] === "assets") {
			baseFilePath = "";
		}
		full_path = path.join(process.cwd(), baseFilePath+((req_path === "/") ? "/index.html" : req_path));
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

						switch(full_path.split(".")[1]) {
						case "mp3":
							console.log("mp3 bitches");
							stat = fs.statSync(full_path);
							
							response.writeHead(200, {
								'Content-Type': 'audio/mpeg',
								'Content-Length': stat.size
							});
							
							readStream = fs.createReadStream(full_path);
							readStream.on('data', function(data) {
								response.write(data);
							});
							
							readStream.on('end', function() {
								response.end();
							});
							break;
						default:
							console.log("anyting else");
							response.writeHeader(200);
							response.write(file, "binary");
							response.end();
						}
						
					}
				});
			}
		});

	}

}).listen(process.env.VMC_APP_PORT || 1337, null);