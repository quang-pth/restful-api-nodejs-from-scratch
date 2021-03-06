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
    fs.open(lib.baseDir + file + '.log', 'a', function (err, fileDescriptor) {
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

// list all the logs, and optionally include the compressed logs
lib.list = function (includeCompressedLogs, callback) {
    fs.readdir(lib.baseDir, function (err, data) {
        if (!err && data && data.length) {
            const trimmedFileNames = [];
            data.forEach(function (fileName) {
                // add the .log files
                if (fileName.indexOf('.log') > -1) {
                    trimmedFileNames.push(fileName.replace('.log', ''));
                }

                // add on the .gz files
                if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
                    trimmedFileNames.push(fileName.replace('.gz.b64', ''));
                }
            });
            callback(false, trimmedFileNames);
        } else {
            callback(err, data);
        }
    })
}

// compress the contents of one .log file into a .gz.b64 file within the same dir
lib.compress = function (logId, newFileId, callback) {
    const sourceFile = logId + '.log';
    const destFile = newFileId + ".gz.b64";

    // read the source file
    fs.readFile(lib.baseDir + sourceFile, 'utf-8', function (err, inputString) {
        if (!err && inputString) {
            // compree the data using gzip
            zlib.gzip(inputString, function (err, buffer) {
                if (!err && buffer) {
                    // send the data to the destination file
                    fs.open(lib.baseDir + destFile, 'wx', function (err, fileDescriptor) {
                        if (!err && fileDescriptor) {
                            // write to the destination file
                            fs.writeFile(fileDescriptor, buffer.toString('base64'), function (err) {
                                if (!err) {
                                    // close the dest file
                                    fs.close(fileDescriptor, function (err) {
                                        if (!err) {
                                            callback(false);
                                        } else {
                                            callback(err);
                                        }
                                    });
                                } else {
                                    callback(err);
                                }
                            } )
                        } else {
                            callback(err);
                        }
                    })
                } else {
                    callback(err);
                }
            })
        } else {
            callback(err);
        }
    });
}

// decompress the content of a .gz.b64 file into a string variable
lib.decompress = function (fileId, callback) {
    const fileName = fileId + '.gz.b64';
    fs.readFile(lib.baseDir + fileName, 'utf-8', function (err, str) {
        if (!err && str) {
            // decompress the data
            const inputBuffer = Buffer.from(str, 'base64');
            zlib.unzip(inputBuffer, function (err, outputBuffer) {
                if (!err && outputBuffer) {
                    // callback 
                    const str = outputBuffer.toString();
                    callback(false, str);
                } else {
                    callback(err);
                }
            })
        } else {
            callback(err);
        }
    })
}


// truncate a log file
lib.truncate = function (logId, callback) {
    fs.truncate(lib.baseDir + logId + '.log', 0, function (err) {
        if (!err) {
            callback(false);
        } else {
            callback(err);
        }
    });
}



// export the module 
module.exports = lib;

