/**
 * Primary file for the API
 * 
 * 
 * 
 */

// Dependencies
const http = require('http');
const url = require('url');

// The server should response to all requests with a string
const server = http.createServer(function (req, res) {
    
    res.end('Hello World\n');
});


// start the server and have it listened on port 3000
server.listen(3000, function () {
    console.log("The server is listening on port 3000 now");
})

