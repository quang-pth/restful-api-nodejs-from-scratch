/**
 * server-realted tasks
 * 
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server')


// instantiate the server module object
const server = {};

// instantiate the HTTP server
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});

// instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
    server.unifiedServer(req, res);
});

// all the server logic for both http and https server
server.unifiedServer = function (req, res) {
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
        const chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
    
        // construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer),
        };

        debug(data.payload);
    
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
                
            // If the response is 200 print green otherwise print red
            if (statusCode === 200) {
                debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);

            }
        })
    });
};

// Define a request router
server.router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks,
};

// init script
server.init = function () {
    // start the HTTP server
    server.httpServer.listen(config.httpPort, function () {
        console.log('\x1b[36m%s\x1b[0m', (`HTTP server is listening on port ${config.httpPort}`));
    });

    // start the HTTPS server
    server.httpsServer.listen(config.httpsPort, function () {
        console.log('\x1b[35m%s\x1b[0m', (`HTTP server is listening on port ${config.httpsPort}`));
    })

}


// export the module 
module.exports = server;