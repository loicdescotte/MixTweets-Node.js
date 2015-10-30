var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var Twitter = require('twitter');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/stream", function(req, res) {

  var queryParams = url.parse(req.url, true).query;

  var client = new Twitter({
    consumer_key: 'xxx',
    consumer_secret: 'xxx',
    access_token_key: 'xxx',
    access_token_secret: 'xxx'
  });

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

 res.write("\n");

  res.socket.on('close', function () {
    console.log('Client leave');
    //client.close();
  });
 
 queryParams.topics.split(",").forEach(function (param) {
    console.log("query param : ", param);
    client.stream('statuses/filter', {track: param},  function(stream){
      stream.on('data', function(tweet) {
        var data = {author: tweet.user.name, message: param + " : " + tweet.text};
        res.write("event: message\n");
        console.log("data: " + JSON.stringify(data) + "\n");        
        res.write("data: " + JSON.stringify(data) + "\n\n");
      });

      stream.on('error', function(error) {
        console.log(error);
      });
   });
 });
   
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
