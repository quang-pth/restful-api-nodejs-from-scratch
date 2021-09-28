// this is the request handlers


// dependencies
const _data = require('./data');
const helpers = require('./helpers');


// define the handlers
const handlers = {};

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
    const phone = typeof (dataToStore.payload.phone) == 'string' && dataToStore.payload.phone.trim().length == 10 ? dataToStore.payload.phone.trim() : false;
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
// @TODO only let an authenticated user access their object.
handlers._users.get = function (requestedData, callback) {
    // check that the phone number is valid
    const phone = typeof (requestedData.queryStringObject.phone) == 'string' && requestedData.queryStringObject.phone.trim().length == 10 ? requestedData.queryStringObject.phone.trim() : false;
    if (phone) {
        // lookup the user
        _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
                // remove the hashed password from the user object
                delete userData.password;
                callback(200, userData);
            } else {
                callback(404);
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
}

// user - put
// required data: phone
// optional data: firstName, lastName, password (1 must be specified)
// @TODO only let an authenticated user update their object.
handlers._users.put = function (dataToUpdate, callback) {
    // check for the required field
    const phone = typeof (dataToUpdate.payload.phone) == 'string' && dataToUpdate.payload.phone.trim().length == 10 ? dataToUpdate.payload.phone.trim() : false;
    //  check optional field
    const firstName = typeof (dataToUpdate.payload.firstName) == 'string' && dataToUpdate.payload.firstName.trim().length > 0 ? dataToUpdate.payload.firstName.trim() : false;
    const lastName = typeof (dataToUpdate.payload.lastName) == 'string' && dataToUpdate.payload.lastName.trim().length > 0 ? dataToUpdate.payload.lastName.trim() : false;
    const password = typeof (dataToUpdate.payload.password) == 'string' && dataToUpdate.payload.password.trim().length > 0 ? dataToUpdate.payload.password.trim() : false;
    // error if the phone is invalid
    if (phone) {
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
        callback(400, { 'Error': 'Missing required field' });
    }

}

// user - delete
// required data: phone
// @TODO only let an authenticated user delete their object.
// @TODO delete any other data files associated with this user
handlers._users.delete = function (data, callback) {
    // check that the phone number is valid
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // lookup the user
        _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
                _data.delete('users', phone, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not find the specified user' });
                    }
                })
            } else {
                callback(400, {'Error': 'Could not find the specified user'});
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
}


// ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

// not found handlers
handlers.notFound = function (data, callback) {
    callback(404);
};


// export the module
module.exports = handlers;