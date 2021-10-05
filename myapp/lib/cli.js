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
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');

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
    const commands = {
        'man': 'Kill the CLI (and the rest of the application)',
        'exit': 'Show this help page',
        'help': 'Alias of the man "man" command',
        'stats': 'Get statistics on the undelying operating system and resource utilization',
        'list users': 'Show a list of all the registered (undeleted) users in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list checks --up  --down': 'Show a list of all the active checks in the system, including their stats. The "--up" and "--down" are both optional',
        'more check info --{checkId}': 'Show details of a specified check',
        'list logs': 'Show a list of all the logs file available to be read (compressed only)',
        'more log info --{fileName}': 'Show details of a specified log file',
    };

    // show a header for the help page that is as wide as the screen
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // show each command followed by its explanation in while and yellow respectively
    for (const cmd in commands) {
        if (commands.hasOwnProperty(cmd)) {
            const cmdInfo = commands[cmd];
            let line = '\x1b[33m' + cmd + '\x1b[0m';
            const padding = 60 - line.length; // cmds info standing in a straight vertical line
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += cmdInfo;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(1);
    // end with another horizontal line
    cli.horizontalLine();
}

// create a vertical line
cli.verticalSpace = function (lines) {
    lines = typeof (lines) == 'number' && lines ? lines : 1;
    for (let i = 0; i < lines; i++) {
        console.log('');
    }
}

// create a horizontal line
cli.horizontalLine = function () {
    // get the available screen size
    const width = process.stdout.columns;
    let line = '';
    for (let i = 0; i < width; i++) line += '-';
    console.log(line);
}

// create centered text in the screen
cli.centered = function (str) {
    str = typeof (str) == 'string' && str.trim().length ? str.trim() : '';
    const width = process.stdout.columns;
    // calculate the left padding there should be
    const leftPadding = Math.floor((width - str.length) / 2);
    // put in left padded spaces before the string itself
    let line = '';
    for (let i = 0; i < leftPadding; i++) line += ' ';
    line += str;
    console.log(line);
}

// exit
cli.responders.exit = function () {
    process.exit(0);
}

cli.responders.stats = function () {
    // compile an object of stats
    const stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime': os.uptime() + ' seconds',
    };
    // create STATS header
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);

    for (const statName in stats) {
        if (stats.hasOwnProperty(statName)) {
            const statInfo = stats[statName];
            let line = '\x1b[33m' + statName + '\x1b[0m';
            const padding = 60 - line.length; // cmds info standing in a straight vertical line
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += statInfo;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(1);
    cli.horizontalLine();
}

cli.responders.listUsers = function () {
    _data.list('users', function (err, userIds) {
        if (!err && userIds && userIds.length) {
            cli.verticalSpace();
            userIds.forEach(userId => {
                _data.read('users', userId, function (err, userData) {
                    if (!err && userData) {
                        let line = ('Name: ' + userData.firstName + ' ' +
                            userData.lastName + ' Phone: ' + userData.phone + ' Checks: ');
                        const numberOfChecks = (typeof (userData.checks) == 'object' &&
                            userData.checks instanceof Array && userData.checks.length ?
                            userData.checks.length : 0);
                        line += numberOfChecks;
                        console.log(line);
                        cli.verticalSpace();
                    }
                });
            });
        }
    });
}

cli.responders.moreUserInfo = function (str) {
    // get the ID from the string 
    const arr = str.split('--');
    const userId = typeof (arr[1]) == 'string' && arr[1].trim().length ? arr[1].trim() : false;
    if (userId) {
        // lookup the user
        _data.read('users', userId, function (err, userData) {
            if (!err && userData) {
                // remove the hashed password
                delete userData.password;

                // print the user JSON with text highlighting
                cli.verticalSpace();
                console.dir(userData, { 'colors': true });
                cli.verticalSpace();

            }
        })
    }
}

cli.responders.listChecks = function (str) {
    _data.list('checks', function (err, checkIds) {
        if (!err && checkIds && checkIds.length) {
            cli.verticalSpace();
            checkIds.forEach(function (checkId) {
                _data.read('checks', checkId, function (err, checkData) {
                    let includeCheck = false;
                    const lowerString = str.toLowerCase();

                    // get the state, default to down
                    const state = typeof (checkData.state) == 'string' ? checkData.state : 'down';
                    // get the state, default to unknown
                    const stateOrUnknown = typeof (checkData.state) == 'string' ? checkData.state : 'unknown';
                    // if the user has specified the state or hasn't specified the state any state, include the current accordingly
                    if (lowerString.indexOf('--' + state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)) {
                        const line = ('ID: ' + checkData.id + ' ' + checkData.method.toUpperCase() +
                            ' ' + checkData.protocol + '://' + checkData.url + ' State: ' + stateOrUnknown);
                        console.log(line);
                        cli.verticalSpace();
                    }

                })
            })
        
        
        }
    })
}

cli.responders.moreCheckInfo = function (str) {
    // get the ID from the string 
    const arr = str.split('--');
    const checkId = typeof (arr[1]) == 'string' && arr[1].trim().length ? arr[1].trim() : false;
    if (checkId) {
        // lookup the user
        _data.read('checks', checkId, function (err, checkData) {
            if (!err && checkData) {
                cli.verticalSpace();
                console.dir(checkData, { 'colors': true });
                cli.verticalSpace();
            }
        })
    }
}

cli.responders.listLogs = function () {
    _logs.list(true, function (err, logFileNames) {
        if (!err && logFileNames && logFileNames.length) {
            cli.verticalSpace();
            logFileNames.forEach(function (logFileName) {
                if (logFileName.indexOf('-') > -1) {
                    console.log(logFileName);
                    cli.verticalSpace();
                }
            });
        }
    })
}

cli.responders.moreLogInfo = function (str) {
    // get the ID from the string 
    const arr = str.split('--');
    const logFileName = typeof (arr[1]) == 'string' && arr[1].trim().length ? arr[1].trim() : false;
    if (logFileName) {
        // decompress the log
        _logs.decompress(logFileName, function (err, logData) {
            if (!err && logData) {
                // split into ines
                const arr = logData.split('\n');
                arr.forEach(function (jsonString) {
                    const logObject = helpers.parseJsonToObject(jsonString);
                    if (logObject && JSON.stringify(logObject) !== '{}') {
                        console.dir(logObject, { 'colors': true });
                        cli.verticalSpace();
                    }
                })
            }
        })
    }
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
