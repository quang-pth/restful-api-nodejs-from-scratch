/**
 * Library for storing data and editing data
 * 
 */

// dependencies
const fs = require('fs');
const path = require('path');

// container for the module (to be exported)
const lib = {};

// base the directory of the .data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = function (dir, file, data, callback) {
    // open the file for writing
    const fileToWrite = lib.baseDir + dir + '/' + file + '.json';
    fs.open(fileToWrite, 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            });


        } else {
            callback('Could not create new file, it may already existed');
        }
    });
};

// read data from a file
lib.read = function (dir, file, callback) {
    const fileToRead = lib.baseDir + dir + '/' + file + '.json';
    fs.readFile(fileToRead, 'utf-8', function (err, data) {
        callback(err, data);
    })
};

// export the module
module.exports = lib;