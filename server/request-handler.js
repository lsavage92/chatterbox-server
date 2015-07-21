var fs = require("fs");
var path = require("path");

var messages = JSON.parse(fs.readFileSync(path.join(__dirname, "fixture.json"), "utf8"));

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;

  if(request.url === "/" && request.method === "GET"){
    headers['Content-Type'] = "text/html";
    response.writeHead(statusCode, headers);
    var filename = path.join(__dirname, "../client/index.html");
    var file = fs.readFileSync(filename, "utf8");
    response.end(file);
  } else if(request.url === "/classes/messages" && request.method === "GET"){
    headers['Content-Type'] = "application/json";
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({results: messages}));
  } else if(request.url === "/classes/messages" && request.method === "POST"){
    var data = '';
    request.on('data', function(postData) {
      data += postData;
    });
    request.on('end', function() {
      console.log(data);
      //messages.push(JSON.parse(request.body));
      response.writeHead(201, headers);
      response.end("CREATED");
    });
  } else {
    response.writeHead(404)
    response.end('404 - file not found');
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = requestHandler;