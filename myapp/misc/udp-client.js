/**
 * example UDP Client
 * sending a message to a DUP server on 6000
 */

const dgram = require('dgram');

// create a client
const client = dgram.createSocket('udp4');

// define the message and pull it into a buffer
const messageString = 'This is a message';
const messageBuffer = Buffer.from(messageString);

// send off the message
client.send(messageBuffer, 6000, 'localhost', function (err) {
    client.close();
});

