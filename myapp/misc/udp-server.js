/**
 * example UDP Server
 */

const dgram = require('dgram');

// creata a server 
const server = dgram.createSocket('udp4');

server.on('message', function (messageBuffer, sender) {
    // do sth with an incomming message or with the sender
    const messageString = messageBuffer.toString();
    console.log(messageString);
});

// bind to 6000
server.bind(6000);