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

// init function 
app.init = function (callback) {
    // start the server
    server.init();

    // start the workder
    workers.init();

    // start the CLI, make sure it starts last
    setTimeout(function() {
        cli.init();
        callback();
    }, 50);

};

// self evoking only if required directly
if (require.main === module) {
    app.init(function() {});
}

// export the app
module.exports = app;

