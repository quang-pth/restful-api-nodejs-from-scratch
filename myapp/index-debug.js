/**
 * Primary file for the API
 * 
 * 
 */

// dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');
const cli = require('./lib/cli');
// node inspect index-debug to start debugging
// cont to next, repl to check var
const exampleDebuggindProblem = require('./lib/exampleDebuggingProblem');

// declare the app
const app = {};

// init function 
app.init = function () {
    // start the server
    debugger;
    server.init();
    debugger;
    
    // start the workder
    debugger;
    workers.init();
    debugger;
    
    // start the CLI, make sure it starts last
    debugger;
    setTimeout(function() {
        cli.init();
        debugger;
    }, 50);
    debugger;
    
    // set foo to 1
    let foo = 1;
    console.log('Just assigned 1 to foo');
    debugger;
    
    // increment
    foo++;
    console.log('Just increment foo');
    debugger;
    
    // square foo
    foo = foo * foo;
    console.log('Just square foo');
    debugger;
    
    // conver foo to a string
    foo = foo.toString();
    console.log('Just convert foo to a string');
    debugger;
    
    // call the init script that throw err
    exampleDebuggindProblem.init();
    console.log('Just called the library');
    debugger;
};

// execute 
app.init();

// export the app
module.exports = app;

