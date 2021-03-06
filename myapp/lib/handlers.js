// this is the request handlers


// dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
const _url = require('url');
const dns = require('dns');
const { performance, PerformanceObserver} = require('perf_hooks');
const util = require('util');
const debug = util.debuglog('performance');

// define the handlers
const handlers = {};

/**
 * HTML Handlers
 */

// index handler
handlers.index = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Uptime Monitoring - Made Simple',
            'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we\'ll send you a text to let you know',
            'body.class': 'index'
        };

        // read in a template as a string
        helpers.getTemplate('index', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// create account handler
handlers.accountCreate = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Create an Account',
            'head.description': 'Signup is easy and only takes a few seconds',
            'body.class': 'accountCreate'
        };

        // read in a template as a string
        helpers.getTemplate('accountCreate', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// create new session
handlers.sessionCreate = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Login to your Account',
            'head.description': 'Please enter your phone number and password to access your account',
            'body.class': 'sessionCreate'
        };

        // read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// delete session
handlers.sessionDeleted = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Logged Out',
            'head.description': 'You have been log out of your account',
            'body.class': 'sessionDeleted'
        };

        // read in a template as a string
        helpers.getTemplate('sessionDeleted', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// edit your account
handlers.accountEdit = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Account Settings',
            'body.class': 'accountEdit'
        };

        // read in a template as a string
        helpers.getTemplate('accountEdit', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// account has been deleted
handlers.accountDeleted = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Account Deleted',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountEdit'
        };

        // read in a template as a string
        helpers.getTemplate('accountDeleted', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// create a new check
handlers.checksCreate = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Create a New Check',
            'body.class': 'accountEdit'
        };

        // read in a template as a string
        helpers.getTemplate('checksCreate', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// edit a new check
handlers.checksEdit = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Check Details',
            'body.class': 'checksEdit'
        };

        // read in a template as a string
        helpers.getTemplate('checksEdit', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Dashboard view all checks
handlers.checksList = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {

        // prepare data for interpolation
        const templateData = {
            'head.title': 'Dashboard',
            'body.class': 'checksList'
        };

        // read in a template as a string
        helpers.getTemplate('checksList', templateData, function (err, str) {
            if (!err && str) {
                // add the universal heder and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}


// favicon
handlers.favicon = function (data, callback) {
    // reject any request that isn't GET
    if (data.method == 'get') {
        // read in the favicon's data
        helpers.getStaticAsset('favicon.ico', function (err, data) {
            if (!err && data) {
                // callback the data
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
}

// public asset
handlers.public = function (data, callback) {
    if (data.method == 'get') {
        // get the filename being requested
        const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
        if (trimmedAssetName.length) {
            // read in the asset's data
            helpers.getStaticAsset(trimmedAssetName, function (err, data) {
                if (!err && data) {
                    // determine the content type (default to plain text)
                    let contentType = 'plain';
                    if (trimmedAssetName.indexOf('.css') > -1) contentType = 'css'
                    if (trimmedAssetName.indexOf('.png') > -1) contentType = 'png'
                    if (trimmedAssetName.indexOf('.jpg') > -1) contentType = 'jpg'
                    if (trimmedAssetName.indexOf('.ico') > -1) contentType = 'favicon'
                    // call back the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                }
            })
        } else {
            callback(404);
        }
    } else {
        callback(405);
    }
}


/**
 * JSON API Handlers
 */

// example error
handlers.exampleError = function (data, callback) {
    const err = new Error('This is an example error');
    throw (err);
};

// user handler 
handlers.users = function (data, callback) {
    const acceptaleMethods = ['post', 'get', 'put', 'delete'];
    if (acceptaleMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        // method not allowed
        callback(405);
    }
};

// container for the users sub-methods
handlers._users = {};

// user - post
// required data: firstName, lastName, phone, password, tosAgreement
// optional data: none
handlers._users.post = function (dataToStore, callback) {
    // check that all required fields are filled out
    const firstName = typeof (dataToStore.payload.firstName) == 'string' && dataToStore.payload.firstName.trim().length > 0 ? dataToStore.payload.firstName.trim() : false;
    const lastName = typeof (dataToStore.payload.lastName) == 'string' && dataToStore.payload.lastName.trim().length > 0 ? dataToStore.payload.lastName.trim() : false;
    const phone = typeof (dataToStore.payload.phone) == 'string' && dataToStore.payload.phone.trim().length ? dataToStore.payload.phone.trim() : false;
    const password = typeof (dataToStore.payload.password) == 'string' && dataToStore.payload.password.trim().length > 0 ? dataToStore.payload.password.trim() : false;
    const tosAgreement = typeof (dataToStore.payload.tosAgreement) == 'boolean' && dataToStore.payload.tosAgreement ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesnt already existed
        _data.read('users', phone, function (err, data) {
            if (err) {
                // hash the password
                const hashedPassword = helpers.hash(password);                
                if (hashedPassword) {
                    // create the user object
                    const userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'password': hashedPassword,
                        'tosAgreement': true,
                    };

                    // store the user
                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(400, { 'Error': 'Could not create new user' });
                        }
                    })
                } else {
                    callback(500, { 'Error': 'Could not hash the user\'s password' });
                }

            } else {
                // user already existed
                callback(400, { 'Error': 'A user with that phone number already existed' });
            }
        })

    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }



}

// user - get
// required data: phone
// optional data: none
handlers._users.get = function (requestedData, callback) {
    // check that the phone number is valid
    const phone = typeof (requestedData.queryStringObject.phone) == 'string' && requestedData.queryStringObject.phone.trim().length ? requestedData.queryStringObject.phone.trim() : false;
    if (phone) {
        // get the token from the headers
        const token = typeof (requestedData.headers.token) == 'string' ? requestedData.headers.token : false;
        // verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                // lookup the user
                _data.read('users', phone, function (err, userData) {
                    if (!err && userData) {
                        // remove the hashed password from the user object
                        delete userData.password;
                        callback(200, userData);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, { 'Error': 'Missing required token in header or token is not valid' });
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
}

// user - put
// required data: phone
// optional data: firstName, lastName, password (1 must be specified)
handlers._users.put = function (dataToUpdate, callback) {
    // check for the required field
    const phone = typeof (dataToUpdate.payload.phone) == 'string' && dataToUpdate.payload.phone.trim() ? dataToUpdate.payload.phone.trim() : false;
    //  check optional field
    const firstName = typeof (dataToUpdate.payload.firstName) == 'string' && dataToUpdate.payload.firstName.trim().length > 0 ? dataToUpdate.payload.firstName.trim() : false;
    const lastName = typeof (dataToUpdate.payload.lastName) == 'string' && dataToUpdate.payload.lastName.trim().length > 0 ? dataToUpdate.payload.lastName.trim() : false;
    const password = typeof (dataToUpdate.payload.password) == 'string' && dataToUpdate.payload.password.trim().length > 0 ? dataToUpdate.payload.password.trim() : false;
    // error if the phone is invalid
    if (phone) {
        // get the token from the headers
        const token = typeof (dataToUpdate.headers.token) == 'string' ? dataToUpdate.headers.token : false;
        // verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
        if (tokenIsValid) {
            // if nothing is updated
            if (firstName || lastName || password) {
                // lookup the user
                _data.read('users', phone, function (err, userData) {
                    if (!err && userData) {
                        // update the necessary field
                        if (firstName) userData.firstName = firstName;
                        if (lastName) userData.lastName = lastName;
                        if (password) userData.password = helpers.hash(password);
                        // store user
                        _data.update('users', phone, userData, function (err) {
                            if (!err) {
                                callback(200);
                            } else {
                                console.log(err);
                                callback(500, { 'Error': 'Could not update the error' });
                            }
                        })
                    } else {
                        callback(400, { 'Error': 'The specified user does not existed' });
                    }
                })
            } else {
                callback(400, { 'Error': 'Missing fields to update' });
            }
        } else {
            callback(403, { 'Error': 'Missing required token in header or token is not valid' });
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }

}

// user - delete
// required data: phone
handlers._users.delete = function (data, callback) {
    // check that the phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // get the token from the headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                // lookup the user
                _data.read('users', phone, function (err, userData) {
                    if (!err && userData) {
                        _data.delete('users', phone, function (err) {
                            if (!err) {
                                // delete each of the checks associated with the user
                                const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                const checksToDelete = userChecks.length;
                                if (checksToDelete) {
                                    let checksDeleted = 0;
                                    let deletionErros = false;
                                    userChecks.forEach(checkId => {
                                        // delete the check
                                        _data.delete('checks', checkId, function (err) {
                                            if (err) {
                                                deletionErros = true;
                                            }
                                            checksDeleted++;
                                            if (checksDeleted === checksToDelete) {
                                                if (!deletionErros)  {
                                                    callback(200);
                                                } else {
                                                    callback(500, { "Error": "Error encountered when attempting to delete all of the user\'s checks. All check may not have been deleted from the system successfully" });
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    callback(200);
                                }
                            } else {
                                callback(500, { 'Error': 'Could not find the specified user' });
                            }
                        })
                    } else {
                        callback(400, {'Error': 'Could not find the specified user'});
                    }
                })
            } else {
                callback(403, { 'Error': 'Missing required token in header or token is not valid' });
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
}

// TOKENS
handlers.tokens = function (data, callback) {
    const acceptaleMethods = ['post', 'get', 'put', 'delete'];
    if (acceptaleMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// container for all the tokens method
handlers._tokens = {};

// tokens - post
// required data: phone, password
// optional: none
handlers._tokens.post = function (data, callback) {
    performance.mark('entered function');
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    performance.mark('input validated');
    if (phone && password) {
        performance.mark('beginning user lookup');
        // lookup the user who matches that phone number
        _data.read('users', phone, function (err, userData) {
            performance.mark('user lookup complete');
            if (!err && userData) {
                // hash the sent password and compare it to the password stored in the user object
                performance.mark('beginning password hashing');
                const hashedPassword = helpers.hash(password);
                performance.mark('password hashing complete');
                if (hashedPassword == userData.password) {
                    // if valid, create a new token with a random name. 
                    // set expiration date 1 hour     
                    performance.mark('creating data for token');
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
                    const tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires,
                    };
                    // store the token    
                    performance.mark('beginning storing token');
                    _data.create('tokens', tokenId, tokenObject, function (err) {
                        performance.mark('storing token complete');
                        const obs = new PerformanceObserver((list) => {
                            const measurement = list.getEntriesByType('measure');
                            debug('\x1b[33m%s\x1b[0m', measurement[0].name + ' ' + measurement[0].duration);
                          });
                          obs.disconnect();
                          obs.observe({ entryTypes: ['measure'] });
                        // gather all the measurements
                        performance.measure('Beginning to end', 'entered function', 'storing token complete');
                        performance.measure('Validate user input', 'entered function', 'input validated');
                        performance.measure('User lookup', 'beginning user lookup', 'user lookup complete');
                        performance.measure('Password hashing', 'beginning password hashing', 'password hashing complete');
                        performance.measure('Token data creation', 'creating data for token', 'beginning storing token');
                        performance.measure('Token storing', 'beginning storing token', 'storing token complete');

                        
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { 'Error': 'Could not create the new token' });
                        }
                    })

                } else {
                    callback(400, { 'Error': 'Password did not match the specified user\'s password' });
                }

            } else {
                callback(400, { 'Error': 'Could not find the specified user' });
            }
        })

    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
};

// tokens - get
// required: user id
// optional data: none
handlers._tokens.get = function (data, callback) {
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 19 ? data.queryStringObject.id.trim() : false;
    if (id) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};

// tokens - put
// required: id, extend
// option: none
handlers._tokens.put = function (data, callback) {
    const id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 19 ? data.payload.id.trim() : false;
    const extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend ? true : false;
    if (id && extend) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                // check to make sure the token is still alive
                if (tokenData.expires > Date.now()) {
                    // set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    // store the new updates
                    _data.update('tokens', id, tokenData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { 'Error': 'Could not update the token\'s expiration' });
                        }
                    })
                } else {
                    callback(400, { 'Error': 'The token has already expired, and cannot be extended' });
                }
            } else {
                callback(400, { 'Error': 'Specified token does not exist' });
           }
        });
    } else {
        callback(400, { 'Error': 'Missing required field(s) or field(s) in valid' });
    }

};
// tokens - delete
handlers._tokens.delete = function (data, callback) {
    // check that the phone number is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 19 ? data.queryStringObject.id.trim() : false;
    if (id) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                _data.delete('tokens', id, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not find the specified token' });
                    }
                })
            } else {
                callback(400, {'Error': 'Could not find the specified token'});
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required token' });
    }
};

// verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function (id, phone, callback) {
    _data.read('tokens', id, function (err, tokenData) {
        if (!err && tokenData) {
            // check token is for the given user and not expired
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
}

// ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

// not found handlers
handlers.notFound = function (data, callback) {
    callback(404);
};

// Checks
handlers.checks = function (data, callback) {
    const acceptaleMethods = ['post', 'get', 'put', 'delete'];
    if (acceptaleMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

// container for all checks methods
handlers._checks = {};

// check - post
// required: protocol, url, method, successCode, timeoutSeconds
// optional: none
handlers._checks.post = function (data, callback) {
    const protocol = typeof (data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length ? data.payload.url.trim() : false;
    const method = typeof (data.payload.method) == 'string' && ['get', 'post', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length ? data.payload.successCodes : false;
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // get the token from the headers
        const token = typeof (data.headers.token) == "string" ? data.headers.token : false;

        // lookup the user by reading the token
        _data.read('tokens', token, function (err, tokenData) {
            if (!err && tokenData) {
                const userPhone = tokenData.phone;
                // lookup the user data
                _data.read('users', userPhone, function (err, userData) {
                    if (!err && userData) {
                        const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        // verify that the user has less than the number of max-checks-per-user
                        if (userChecks.length < config.maxChecks) {
                            // verify the url given has DNS entries (and therefore can resolve)
                            const parsedUrl = _url.parse(protocol + '://' + url, true);
                            const hostName = typeof (parsedUrl.hostname) == 'string' && parsedUrl.hostname.length ? parsedUrl.hostname : false;
                            dns.resolve(hostName, function (err, records) {
                                if (!err && records) {
                                    // create a random id for the check
                                    const checkId = helpers.createRandomString(20);
                                    // create the check object and include the user's phone
                                    const checkObject = {
                                        'id': checkId,
                                        'userPhone': userPhone,
                                        'protocol': protocol,
                                        'url': url,
                                        'successCodes': successCodes,
                                        'method': method,
                                        'timeoutSeconds': timeoutSeconds,
                                    };

                                    // save the object
                                    _data.create('checks', checkId, checkObject, function (err) {
                                        if (!err) {
                                            // add the check id to the user object
                                            userData.checks = userChecks;
                                            userData.checks.push(checkId);

                                            // save the new user data
                                            _data.update('users', userPhone, userData, function (err) {
                                                if (!err) {
                                                    // return the data about the new check
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, { 'Error': 'Could not update the user with the new check' });
                                                }
                                            })
                                        } else {
                                            callback(500, { 'Error': 'Could not create the new check' });
                                        }
                                    });
                                } else {
                                    callback(400, { 'Error': 'The hostname of the URL entered did not resolve to any DNS entries' });
                                }
                            })
                        } else {
                            callback(400, { 'Error': 'The user already has the maximum number of checks: (' + config.maxChecks + ')' });
                        }
                    } else {
                        callback(403);
                   }
                });
            } else {
                callback(404, { 'Error': 'Missing required token or token is not valid' });
            }
        });

    } else {
        callback(400, { "Error": "Missing required inputs or inputs are in valid" });
    }
};

// checks - get
// required data: id
// optional: none
handlers._checks.get = function (requestedData, callback) {
    const id = typeof (requestedData.queryStringObject.id) == 'string' && requestedData.queryStringObject.id.trim().length == 19 ? requestedData.queryStringObject.id.trim() : false;
    if (id) {
        // lookup the check
        _data.read('checks', id, function (err, checkData) {
            if (!err && checkData) {
                // get the token from the headers
                const token = typeof (requestedData.headers.token) == 'string' ? requestedData.headers.token : false;
                // verify that the given token is valid and belong to the user who created the check
                handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                    if (tokenIsValid) {
                        // return the check data
                        callback(200, checkData);
                    } else {
                        callback(403, { "Error": "Token is not valid or expired" });
                    }
                })
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
}

// checks - put
// required data: id
// optional data: protocol, url, method, successcode, timeoutSeconds
handlers._checks.put = function (data, callback) {
    // check required field
    const id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 19 ? data.payload.id.trim() : false;
    // check optional field
    const protocol = typeof (data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length ? data.payload.url.trim() : false;
    const method = typeof (data.payload.method) == 'string' && ['get', 'post', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length ? data.payload.successCodes : false;
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (id) {
        //  check optional field(s) are sent
        if (protocol || url || method || successCodes || timeoutSeconds) {
            _data.read('checks', id, function (err, checkData) {
                if (!err && checkData) {
                      // get the token from the headers
                    const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                    // verify that the given token is valid and belong to the user who created the check
                    handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                        if (tokenIsValid) {
                            // update the check where neccessarily
                            if (protocol) checkData.protocol = protocol;
                            if (url) checkData.url = url;
                            if (method) checkData.method = method;
                            if (successCodes) checkData.successCodes = successCodes;
                            if (timeoutSeconds) checkData.timeoutSeconds = timeoutSeconds;

                            // update
                            _data.update('checks', id, checkData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, { "Error": "Could not update the check" });
                                }
                            })

                        } else {
                            callback(403);
                        }
    
                    });
                } else {
                    callback(400, { "Error": "Check ID does not existed" });
                }
            })
        } else {
            callback(400, { "Error": "Missing fields to update" });
        }
    } else {
        callback(400, { "Error": "Missing required field" });
    }

}

// check - delete
// required data: id
// optional: none
handlers._checks.delete = function (data, callback) {
    // check that the phone number is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 19 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // lookup the check
        _data.read('checks', id, function (err, checkData) {
            if (!err && checkData) {
                // get the token from the headers
                const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                // verify that the given token is valid for the phone number
                handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                    if (tokenIsValid) {
                        // delete the check data
                        _data.delete('checks', id, function (err) {
                            if (!err) {
                                // lookup the user
                                _data.read('users', checkData.userPhone, function (err, userData) {
                                    if (!err && userData) {
                                        const userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                        // remove the deleted checks form the check list
                                        const checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            // re-save the user's data
                                            _data.update('users', checkData.userPhone, userData, function (err) {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, { 'Error': 'Could not update the user' });
                                                }
                                            });
                                        } else {
                                            callback(500, { "Error": "Could not find the check on the user\'s object" });
                                        }
                                    } else {
                                        callback(400, { 'Error': 'Could not find the user who created the check' });
                                    }
                                });    
                            } else {
                                callback(500, { "Error": "Could not delete the check data" });
                           }
                        });
                    } else {
                        callback(403, { 'Error': 'Token is not valid or expired' });
                    }
                })
            } else {
                callback(400, { "Error": "Check ID does not exist" });
           }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
}


// export the module
module.exports = handlers;