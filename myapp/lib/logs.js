/**
 * Library for storing and rotating logs
 * 
 */

// dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// container for the module
const lib = {};

// base directory for the logs folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// append a string to a file. Create the file if it does not exist.
lib.append = function (file, str, callback) {
    // open the file for appending
    fs.open(lib.baseDir + file + + '.logs', 'a', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // append to the file and close it
            fs.appendFile(fileDescriptor, str + '\n', function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error: Closing file that was being appending');
                        }
                    })
                } else {
                    callback('Error: Appending the file');
                }
            });
        } else {
            callback('Could not open the file for appending');
        }
    });
}




// export the module 
module.exports = lib;

