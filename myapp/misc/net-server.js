/**
 * example TCP (Net) server
 * 
 */

const net = require('net');

// create server
const server = net.createServer(function (connection) {
    // send the word "pong"
    const outboundMessage = 'pong';
    connection.write(outboundMessage);

    // when the client writes sth, log it out
    connection.on('data', function (inboundMessage) {
        const messageString = inboundMessage.toString();
        console.log("I wrote " + outboundMessage + " and they said " + inboundMessage);
    })
});

server.listen(6000);
 
 