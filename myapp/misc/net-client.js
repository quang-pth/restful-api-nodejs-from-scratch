/**
 * example TCP (Net) Client
 * 
 */

const net = require('net');

// define the message to send
const outboundMessage = 'ping';

// create a client
const client = net.createConnection({ 'port': 6000 }, function (callback) {
    // send the message
    client.write(outboundMessage);
});

// when the server writes back, log what it said then kill the client
client.on('data', function (inboundMessage) {
    const messageString = inboundMessage.toString();
    console.log("I wrote " + outboundMessage + " and they said " + inboundMessage);
    client.end();
})
