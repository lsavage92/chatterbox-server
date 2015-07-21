var express = require("express");
var fs = require("fs");
var path = require("path");
var app = express();
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

app.get('/', function(req, res){
  headers['Content-Type'] = "text/html";
  res.writeHead(200, headers);
  var filename = path.join(__dirname, "../client/index.html");
  var file = fs.readFileSync(filename, "utf8");
  res.end(file);
});

app.get('/classes/messages', function(req, res){
  headers['Content-Type'] = "text/html";
  var filename = path.join(__dirname, "fixture.json");
  var messages = JSON.parse(fs.readFileSync(filename, "utf8"));
  var results = {results: messages};
  res.end(JSON.stringify(results));
});

app.use(express.static('client'));

app.use(function(req, res, next){
  res.status(404).send("404 - Page not found");
});

app.listen(3000);

