/**
 * Helpers for various tasks
 * 
 */

// dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');

// container for the helpers
const helpers = {};

// create a SHA256 hash
helpers.hash = function (str) {
    if (typeof (str) == 'string' && str.length) {
        const hashStr = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hashStr;
    } else {
        return false;
    }
};

// parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
}

// create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
    strLength = typeof (strLength) == 'number' && strLength ? strLength : false;
    if (strLength) {
        // define all characters
        const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // start the final string
        let str = '';
        for (let i = 1; i < strLength; i++) {
            // get random char
            const randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
            // append to the string we're building
            str += randomChar;
        }

        return str;
    } else {
        return false;
    }
}


// send an SMS message via Twilio
helpers.sendTwilioSms = function (phone, msg, callback) {
    // validate phone number
    phone = typeof (phone) == 'string' && phone.trim().length ? phone.trim() : false;
    msg = typeof (msg) == 'string' && msg.trim().length && msg.trim().length <= 1600 ? msg.trim() : false;
    if (phone && msg) {
        // configure the request payload
        const payload = {
            'From': config.twilio.fromPhone,
            'To': '+84' + phone,
            'Body': msg,
        };

        // stringify the payload
        const stringPayload = querystring.stringify(payload);

        // configure the request details
        const requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        };

        // instantiate the request object
        const req = https.request(requestDetails, function (res) {
            // grab the status of the sent request
            const status = res.statusCode;
            // callback successfully if the request went through
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was: ', status);
            }
        });

        // bind to the error event so it doesn't get thrown
        req.on('error', function (err) {
            callback(err);
        });

        // add the payload
        req.write(stringPayload);

        // end the request
        req.end();
    } else {
        callback("Given parameters were missing or invalid");
    }

}


// get the string content of a template
helpers.getTemplate = function (templateName, data, callback) {
    templateName = typeof (templateName) == 'string' && templateName.length ? templateName : false;
    data = typeof (data) == 'object' && data ? data : {};

    if (templateName) {
        const templatesDir = path.join(__dirname, '/../templates/');
        fs.readFile(templatesDir + templateName + '.html', 'utf-8', function (err, str) {
            if (!err && str && str.length) {
                // do interpolation on the string
                const finalString = helpers.interpolate(str, data);
                callback(false, finalString);
            } else {
                callback('No template could be found');
            }
        })
    } else {
        callback('A valid template name was not specified');
    }
}

// add the universal header and footer to a string, and pass the data objec to the header and footer for inpterpolation
helpers.addUniversalTemplates = function (str, data, callback) {
    str = typeof (str) == 'string' && str.length ? str : '';
    data = typeof (data) == 'object' && data ? data : {};
    // get the header
    helpers.getTemplate('_header', data, function (err, headerString) {
        if (!err && headerString) {
            // get the footer 
            helpers.getTemplate('_footer', data, function (err, footerString) {
                if (!err && footerString) {
                    // add header, body and footer together
                    const fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else {
                    callback('Could not find the footer template');
                }
            })
        } else {
            callback('Could not find the header template');
        }
    })


}


// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = function (str, data) {
    str = typeof (str) == 'string' && str.length ? str : '';
    data = typeof (data) == 'object' && data ? data : {};

    // add the templateGlobals to the data object, pretending their key name with "global"
    for (const keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName];
        }
    }

    // for each key in the data object, insert its value into the string at the corresponding placeholder
    for (const key in data) {
        if (data.hasOwnProperty(key) && typeof (data[key]) == 'string') {
            const replace = data[key];
            const find = '{' + key + '}';
            str = str.replace(find, replace);
        }
    }

    return str;
}

// export the module
module.exports = helpers;