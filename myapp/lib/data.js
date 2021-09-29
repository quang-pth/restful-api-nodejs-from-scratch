/**
 * Library for storing data and editing data
 * 
 */

// dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

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
        if (!err && data) {
            const parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    })
};

// update data inside a file
lib.update = function (dir, file, data, callback) {
    const fileToUpdate = lib.baseDir + dir + '/' + file + '.json';
    // open the file for writing 
    fs.open(fileToUpdate, 'r+', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            // truncate the file
            fs.ftruncate(fileDescriptor, function (err) {
                if (!err) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function (err) {
                        if (!err) {
                            fs.close(fileDescriptor, function (err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing the file');
                                }
                            })
                        } else {
                            callback('Error writing to exsting file');
                        }
                    })

                } else {
                    callback('Error truncating the file');
                }
            })
        } else {
            callback('Could not open the file for updating, it may not exist yet');
        }
    });
}

// delete a file
lib.delete = function (dir, file, callback) {
    const fileToDelete = lib.baseDir + dir + '/' + file + '.json';
    // unlink the file
    fs.unlink(fileToDelete, function (err) {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting the file');
        }
    });
}

// list all the items in a directory
lib.list = function (dir, callback) {
    fs.readdir(lib.baseDir + dir + '/', function (err, data) {
        if (!err && data.length) {
            const trimmedFilesNames = [];
            data.forEach(function (fileName) {
                trimmedFilesNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFilesNames);
        } else {
            callback(err, data);
        }
    })
}

// export the module
module.exports = lib;