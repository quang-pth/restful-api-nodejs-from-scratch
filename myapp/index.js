/**
 * Primary file for the API
 * 
 * 
 * 
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');

// testing 
// @TODO delete this
_data.delete('test', 'newFile', function (err) {
    console.log('This was the error: ', err);
})

// instantiate the HTTP server
const httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

// start the HTTP server
httpServer.listen(config.httpPort, function () {
    console.log(`HTTP server is listening on port ${config.httpPort}`);
});

// instantiate the HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});

// start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
    console.log(`HTTPS server is listening on port ${config.httpsPort}`);
})


// all the server logic for both http and https server
const unifiedServer = function (req, res) {
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
};


// Define the handlers
const handlers = {};

handlers.ping = function (data, callback) {
    callback(200);
};

// not found handlers
handlers.notFound = function (data, callback) {
    callback(404);
};


// Define a request router
const router = {
    'ping': handlers.ping
};