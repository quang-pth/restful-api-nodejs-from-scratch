/**
 * Primary file for the API
 * 
 * 
 * 
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;


// The server should response to all requests with a string
const server = http.createServer(function (req, res) {
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    // get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP request
    const method = req.method.toLowerCase();

    // get the headers as an object
    const headers = req.headers;

    // get the payload if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    // streaming data comes in
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();
    
        // send the respond
        res.end("Hello World");

        // log the request path
        console.log('Request received with this payload: ', buffer);
    });



});


// start the server and have it listened on port 3000
server.listen(3000, function () {
    console.log("The server is listening on port 3000 now");
})

