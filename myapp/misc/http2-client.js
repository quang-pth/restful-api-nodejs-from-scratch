/**
 * example HTTP2 Client
 */

// dependencies
const http2 = require('http2');


// creata a client
const client = http2.connect('http://localhost:6000');


// create a request
const req = client.request({
    ':path': '/',
});

// when a message is recieved, add the piecies of it together until you reach the end
let str = '';
req.on('data', function (chunk) {
    str += chunk;
});

// when the message ends, log it out
req.on('end', function () {
    console.log(str);
})

// end the request
req.end();







