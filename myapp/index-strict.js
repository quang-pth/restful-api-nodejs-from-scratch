/**
 * Primary file for the API
 * 
 * 
 */

// dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');
const cli = require('./lib/cli');

// declare the app
const app = {};

// declare a global that a strict mode should catch
foo = 'bar'; // node --use_strict index-strict.js

// init function 
app.init = function () {
    // start the server
    server.init();

    // start the workder
    workers.init();

    // start the CLI, make sure it starts last
    setTimeout(function() {
        cli.init();
    }, 50);

};

// execute 
app.init();

// export the app
module.exports = app;

