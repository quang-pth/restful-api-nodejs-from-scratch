/**
 * example TLS (Net) Client
 * 
 */

const tls = require('tls');
const fs = require('fs');
const path = require('path');

const options = {
    'ca': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')), // only required because we're using a self-signed certificate
}

// define the message to send
const outboundMessage = 'ping';

// create a client
const client = tls.connect(6000, options, function () {
    // send the message
    client.write(outboundMessage);
});

// when the server writes back, log what it said then kill the client
client.on('data', function (inboundMessage) {
    const messageString = inboundMessage.toString();
    console.log("I wrote " + outboundMessage + " and they said " + messageString);
    client.end();
})
