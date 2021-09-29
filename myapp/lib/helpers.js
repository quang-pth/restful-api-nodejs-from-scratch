/**
 * Helpers for various tasks
 * 
 */

// dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

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


// export the module
module.exports = helpers;