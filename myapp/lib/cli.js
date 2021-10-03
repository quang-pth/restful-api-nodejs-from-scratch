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

// input handlers
e.on('man', function (str) {
    cli.responders.help();
});

e.on('help', function (str) {
    cli.responders.help();
});

e.on('exit', function (str) {
    cli.responders.exit();
})

e.on('stats', function (str) {
    cli.responders.stats();
})

e.on('list users', function (str) {
    cli.responders.listUsers();
});

e.on('more user info', function (str) {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', function (str) {
    cli.responders.listChecks(str);
});

e.on('more check info', function (str) {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', function (str) {
    cli.responders.listLogs();
});

e.on('more log info', function (str) {
    cli.responders.moreLogInfo(str);
});

// responders object
cli.responders = {};

// help / man
cli.responders.help = function () {
    console.log("You asked for help");
}

// exit
cli.responders.exit = function () {
    process.exit(0);
}

cli.responders.stats = function () {
    console.log("You asked for stats");
}

cli.responders.listUsers = function () {
    console.log("You asked for listing users");
}

cli.responders.moreUserInfo = function (str) {
    console.log("You asked for more user info", str);
}

cli.responders.listChecks = function (str) {
    console.log("You asked for listing checks", str);
}

cli.responders.moreCheckInfo = function (str) {
    console.log("You asked for more check info", str);
}

cli.responders.listLogs = function () {
    console.log("You asked for listing logs");
}

cli.responders.moreLogInfo = function (str) {
    console.log("You asked for more log info", str);
}
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