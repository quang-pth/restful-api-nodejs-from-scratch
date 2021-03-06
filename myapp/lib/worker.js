/**
 * worker-related tasks
 */

// dependencies
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');
const _logs = require('./logs');
const util = require('util');
// start the node app with flat NODE_DEBUG=workers to see the workers process
const debug = util.debuglog('workers')


// instantiate the worker object
const workers = {};

// lookup all checks, get their data, send to a validator
workers.gatherAllChecks = function () {
    // get all the checks
    _data.list('checks', function (err, checks) {
        if (!err && checks && checks.length) {
            checks.forEach(check => {
                // read in the check data
                _data.read('checks', check, function (err, originalCheckData) {
                    if (!err && originalCheckData) {
                        // pass it to the check validator
                        // and let that function continue or log error as needed
                        workers.validateCheckData(originalCheckData);
                    } else {
                        debug("Error: Reading one of the checks\'s data")
                    }

                });
            });
        } else {
            debug("Error: Could not find any checks to process");
        }
    });
}

// santiy-checking the check-data
workers.validateCheckData = function (originalCheckData) {
    originalCheckData = typeof (originalCheckData) == 'object' && originalCheckData ? originalCheckData : {};
    originalCheckData.id = typeof (originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 19 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone = typeof (originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol = typeof (originalCheckData.protocol) == 'string' && ["http", "https"].indexOf(originalCheckData.protocol.toLowerCase()) > -1 ? originalCheckData.protocol : false;
    originalCheckData.url = typeof (originalCheckData.url) == 'string' && originalCheckData.url.trim().length ? originalCheckData.url.trim() : false;
    originalCheckData.method = typeof (originalCheckData.method) == 'string' && ["get", "post", "put","delete"].indexOf(originalCheckData.method) > - 1 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof (originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array ? originalCheckData.successCodes : false;
    originalCheckData.timeoutSeconds = typeof (originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;
    
    // set the keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state = typeof (originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked ? originalCheckData.lastChecked : false;
    

    // if all the checks pass, pass the data along to the next step in the process
    const checkIsValid = (originalCheckData.id && originalCheckData.userPhone
        && originalCheckData.protocol && originalCheckData.url
        && originalCheckData.method && originalCheckData.successCodes && originalCheckData.timeoutSeconds);
    if (checkIsValid) {
        workers.performCheck(originalCheckData);
    } else {
        debug("Error: One of the checks is not properly formatted. Skipping it");
    }
}

// perform the check, send the originalCheckData and the outcome to the check process
// to the next step in the process
workers.performCheck = function (originalCheckData) {
    // prepare the initial check outcome
    const checkOutcome = {
        'error': false,
        'responseCode': false
    };

    // mark that the outcome has not been sent yet
    let outcomeSent = false;

    // parse the hostname and the path out of the original check data
    const parsedUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true);
    const hostName = parsedUrl.hostname;
    const path = parsedUrl.path; // using path and not the "pathname" because we want the query string
    
    // construct the request
    const requestDetails = {
        'protocol': originalCheckData.protocol + ":",
        'hostname': hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000
    };

    // instantiate the request object using either the http or https module
    const _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
    const req = _moduleToUse.request(requestDetails, function (res) {
        debug(`${requestDetails.hostname} with status code: ${res.statusCode}`);
        // grab the status of the sent request
        const status = res.statusCode;

        // update the checkoutcome and pass the data along
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // bind to the error event so it doesn't get thrown
    req.on('error', function (err) {
        // update the checkoutcome and pass the data along
        checkOutcome.error = {
            "error": true,
            'value': err
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // bind to the timeout event
    req.on('timeout', function (err) {
        // update the checkoutcome and pass the data along
        checkOutcome.error = {
            "error": true,
            'value': 'timeout'
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // end the request 
    req.end();
};

// process the check outcome and update the check data as needed, trigger and alert if needed
// special logic for accomodating a check that has never been tested before (don't alert on that one)
workers.processCheckOutcome = function (originalCheckData, checkOutcome) {
    // decide if the check is considered up or down
    const state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    // decide if an alert is warranted
    const alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;
    
    // log the outcome 
    const timeOfCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);
    
    // update the check data
    const newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;

    // save the update
    _data.update('checks', newCheckData.id, newCheckData, function (err) {
        if (!err) {
            // send the new check data to the next phase in the process if needed
            if (alertWarranted) {
                workers.alertUserToStatusChange(newCheckData);
            } else {
                debug("Check outcome has not changed, no alert needed");
            }
        } else {
            debug("Error: Trying to save updates to one of the checks");
        }
    });
}

// Alert the user as to a change in their check status
workers.alertUserToStatusChange = function (newCheckData) {
    const msg = ("Alert: Your check for " + newCheckData.method.toUpperCase() + " "
        + newCheckData.protocol + "://" + newCheckData.url
        + " is currently " + newCheckData.state);
    helpers.sendTwilioSms(newCheckData.userPhone, msg, function (err) {
        if (!err) {
            debug("Success: User was alerted to a change in their check, via sms: ", msg);
        } else {
            debug("Error: Could not send sms to user who had a state change in their check: ", err);
        }
    })
}

workers.log = function (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) {
    // form the log data
    const logData = {
        'check': originalCheckData,
        'outcome': checkOutcome,
        'state': state,
        'alert': alertWarranted,
        'time': timeOfCheck
    };

    // convert data to a strint to store in log fs
    const logString = JSON.stringify(logData);

    // determine the name of the file
    const logFileName = originalCheckData.id;

    // append the log string to the file
    _logs.append(logFileName, logString, function (err) {
        if (!err) {
            debug("Logging to file success");
        } else {
            debug("Logging to file failed");
        }
    });

};


// timer to execute the worker-process once per minute
workers.loop = function () {
    setInterval(function () {
        workers.gatherAllChecks();
    }, 1000 * 60);
}

// rotate (compress) the logs
workers.rotateLogs = function () {
    // list all the (non-compressed) log files
    _logs.list(false, function (err, logs) {
        if (!err && logs && logs.length) {
            logs.forEach(function (logName) {
                // compress the data to a different file 
                const logId = logName.replace('.log', '');
                const newFileId = logId + '-' + Date.now();
                _logs.compress(logId, newFileId, function (err) {
                    if (!err) {
                        // truncate the log (delete old log after move it to new file)
                        _logs.truncate(logId, function (err) {
                            if (!err) {
                                debug("Success: Truncating log file");
                            } else {
                                debug("Error: Truncating log file");
                            }
                        });
                    } else {
                        debug("Error: Compressing one of the log files ", err);
                    }
                });
            });
        } else {
            debug("Error: Could not find any logs to rotate");
        }
    });
}

// timer to execute the log-rotation process once per day
workers.logRotationLoop = function () {
    setInterval(function () {
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24);
}

// init script
workers.init = function () {
    // send to console in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');

    // execute all the checks 
    workers.gatherAllChecks();

    // call the loop so the checks will execute later on
    workers.loop();

    // compress all the logs immediately
    workers.rotateLogs();

    // call the compressing loop so logs will be compress later on
    workers.logRotationLoop();
}


// export the module 
module.exports = workers;








