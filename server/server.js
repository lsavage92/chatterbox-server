var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var messagesById = _.indexBy(_.map(JSON.parse(fs.readFileSync(path.join(__dirname, "fixture.json"), "utf8")), function(message) {
  message.createdAt = Date.now();
  return message;
}), 'id');

var getUniqueId = function() {
  var ids = Object.keys(messagesById);
  ids.sort();
  return _.last(ids) + 1;
};

app.get('/classes/messages', function(req, res){
  var messages = _.map(messagesById, function(message) {
    return message;
  });
  res.type('application/json').status(200).json({results: messages});
});

app.post('/classes/messages', function(req, res){
  var message = req.body;
  message.id = getUniqueId();
  message.createdAt = Date.now();
  messagesById[message.id] = message;
  res.type('application/json').status(201).json(message);
});

app.put('/classes/messages/:id', function(req, res){
  var message = messagesById[req.params.id];
  _.extend(message, req.body);
  res.type('application/json').status(200).json(message);
});

app.delete('/classes/messages/:id', function(req, res){
  var message = messagesById[req.params.id];
  delete messagesById[req.params.id];
  res.type('application/json').status(200).json(message);
});

app.use(express.static('client'));

app.use(function(req, res, next){
  res.status(404).send("404 - Page not found");
});

app.listen(3000);

