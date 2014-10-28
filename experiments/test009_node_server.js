"use strict";

var http = require("http");
var server = http.createServer(function(request, response){
    console.log("request made: ",request.headers, request.url);
    response.writeHeader(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
});
server.listen(8080);
console.log("Server Running on 8080");