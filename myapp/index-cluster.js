/**
 * Primary file for the API
 * 
 * 
 */

// dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');
const cli = require('./lib/cli');
const cluster = require('cluster');
const os = require('os');

// declare the app
const app = {};

// init function 
app.init = function (callback) {
    // if we're on the master thread start the background workers and the CLI
    if (cluster.isMaster) {
        // start the workder
        workers.init();
        
        // start the CLI, make sure it starts last
        setTimeout(function() {
        cli.init();
        callback();
        }, 50);
        
        // fork the process
        for (let i = 0; i < os.cpus().length; i++) {
            cluster.fork();
        }

    }
    else {
        // if we're not on the master thread, start the HTTP server
        server.init();
    }
    


};

// self evoking only if required directly
if (require.main === module) {
    app.init(function() {});
}

// export the app
module.exports = app;

