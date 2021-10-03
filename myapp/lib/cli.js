/**
 * CLI-related Tasks
 * 
 */

// dependencies
const readLine = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events { };
const e = new _events();


// instatiate the CLI module object
const cli = {};

// input processor
cli.processInput = function (str) {
    str = typeof (str) == 'string' && str.trim().length ? str.trim() : false;
    // only process the input if user acctually wrote sth. Otherwise ignore
    if (str) {
        // codify the unique strings that identity the unique questions allowed to be asked
        const uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        // go through the possible inputs, emit an event when a match is found
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some(function (input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // emit an matching event and include the full string given
                e.emit(input, str);
                return true;
            }
        });

        // if no match is found, tell the user to write again
        if (!matchFound) {
            console.log("Sorry, try again");
        }

    } 
}


// init script
cli.init = function () {
    // send the start message to the console, in dark blue
    console.log('\x1b[34m%s\x1b[0m', "The CLI is running");

    // start the interface
    const _interface = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });

    // create an initial prompt
    _interface.prompt();

    // hanle each line of input seperately
    _interface.on('line', function (str) {
        // send to the input processor
        cli.processInput(str);

        // re-initialize the prompt afterwardds
        _interface.prompt();
    });

    // if the user stops the CLI, stop the associated process
    _interface.on('close', function () {
        process.exit(0);
    })

}




// export the module
module.exports = cli;
