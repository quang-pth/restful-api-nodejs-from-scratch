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
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // get the path
    const path = parsedUrl.pathname;
    console.log(path);
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    // send the respond
    res.end("Hello World");

    // log the request path
    console.log('Request received on path: ' + trimmedPath);

});


// start the server and have it listened on port 3000
server.listen(3000, function () {
    console.log("The server is listening on port 3000 now");
})

