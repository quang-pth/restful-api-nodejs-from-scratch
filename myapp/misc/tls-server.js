/**
 * example TLS (Net) server
 * 
 */

const tls = require('tls');
const fs = require('fs');
const path = require('path');

// server options
const options = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
}

// create server
const server = tls.createServer(options, function (connection) {
    // send the word "pong"
    const outboundMessage = 'pong';
    connection.write(outboundMessage);

    // when the client writes sth, log it out
    connection.on('data', function (inboundMessage) {
        const messageString = inboundMessage.toString();
        console.log("I wrote " + outboundMessage + " and they said " + messageString);
    })
});

server.listen(6000);
 
 