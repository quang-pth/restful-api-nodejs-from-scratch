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

// export the module
module.exports = helpers;