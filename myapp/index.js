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
    // Ts Routing Request
    req.on('end', function () {
        buffer += decoder.end();
    
        // chose the hanlder the req should go to. If one is not found use the notFound handler
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {
            // use the status code called back by the handler, or default handler 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // use the payload called back by the handler or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // convert payload (send back to user) to a string
            const payloadString = JSON.stringify(payload);

            // return the response
            res.setHeader('Content-Type', 'application/json'); // returning JSON
            res.writeHead(statusCode); // write status code to the res
            res.end(payloadString);
            
            // log the request path
            console.log('Returning this response: ', statusCode, payloadString);
        })
    });
});


// start the server and have it listened on port 3000
server.listen(3000, function () {
    console.log("The server is listening on port 3000 now");
})

// Define the handlers
const handlers = {};

// Sample handlers
handlers.sample = function (data, callback) {
    // callback a http status code and a payload object
    callback(406, { 'name': 'sample handlers' });
}

// not found handlers
handlers.notFound = function (data, callback) {
    callback(404);
}


// Define a request router
const router = {
    'sample': handlers.sample
};