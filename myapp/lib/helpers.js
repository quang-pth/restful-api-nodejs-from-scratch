/**
 * Helpers for various tasks
 * 
 */

// dependencies
const crypto = require('crypto');
const config = require('./config');

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

// export the module
module.exports = helpers;