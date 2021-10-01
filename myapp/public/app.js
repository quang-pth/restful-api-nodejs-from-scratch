/**
 * Frontend Logic for the Application
 */

// container for the frontend application
const app = {};

// config
app.config = {
    'sessionToken': false,
};

// AJAX Client for the restful API
app.client = {};

// interface for making API calls
app.client.request = function (headers, path, method, queryStringObject, payload, callback) {
    // set defaults
    headers = typeof (headers) == 'object' && headers ? headers : {};
    path = typeof (path) == 'string' ? path : '/';
    method = typeof (method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof (queryStringObject) == 'object' && queryStringObject ? queryStringObject : {};
    payload = typeof (payload) == 'object' && payload ? payload : {};
    callback = typeof (callback) == 'function' ? callback : false;

    // for each query string parameter sent, add it to the path
    let requestUrl = path + '?';
    let counter = 0;
    for (const queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++;
            // if at least one query string parameter has already been added, prepend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&';
            }
            // add the key value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }
    }
    
    // form the http request as a JSON type
    const xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // for each header sent, add it to the request
    for (const headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    // if there is a current session token set, add that as header
    if (app.config.sessionToken) {
        xhr.setRequestHeader('token', app.config.sessionToken.id);
    }

    // when the request comesback, handle the respone
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            const statusCode = xhr.status;
            const responeReturned = xhr.responseText;
            // callbback if requested
            if (callback) {
                try {
                    const parsedRes = JSON.parse(responeReturned);
                    callback(statusCode, parsedRes);
                } catch (e) {
                    callback(statusCode, false);
                }
            }
        }
    }
    // send the payload as JSON
    const payloadStr = JSON.stringify(payload);
    xhr.send(payloadStr);
}
