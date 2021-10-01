/**
 * Frontend Logic for the Application
 */

// container for the frontend application
const app = {}

// config
app.config = {
  sessionToken: false,
}

// AJAX Client for the restful API
app.client = {}

// interface for making API calls
app.client.request = function (
  headers,
  path,
  method,
  queryStringObject,
  payload,
  callback,
) {
  // set defaults
  headers = typeof headers == 'object' && headers ? headers : {}
  path = typeof path == 'string' ? path : '/'
  method =
    typeof method == 'string' &&
    ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1
      ? method.toUpperCase()
      : 'GET'
  queryStringObject =
    typeof queryStringObject == 'object' && queryStringObject
      ? queryStringObject
      : {}
  payload = typeof payload == 'object' && payload ? payload : {}
  callback = typeof callback == 'function' ? callback : false

  // for each query string parameter sent, add it to the path
  let requestUrl = path + '?'
  let counter = 0
  for (const queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter++
      // if at least one query string parameter has already been added, prepend new ones with an ampersand
      if (counter > 1) {
        requestUrl += '&'
      }
      // add the key value
      requestUrl += queryKey + '=' + queryStringObject[queryKey]
    }
  }

  // form the http request as a JSON type
  const xhr = new XMLHttpRequest()
  xhr.open(method, requestUrl, true)
  xhr.setRequestHeader('Content-Type', 'application/json')

  // for each header sent, add it to the request
  for (const headerKey in headers) {
    if (headers.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey])
    }
  }

  // if there is a current session token set, add that as header
  if (app.config.sessionToken) {
    xhr.setRequestHeader('token', app.config.sessionToken.id)
  }

  // when the request comesback, handle the respone
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const statusCode = xhr.status
      const responeReturned = xhr.responseText
      // callbback if requested
      if (callback) {
        try {
          const parsedRes = JSON.parse(responeReturned)
          callback(statusCode, parsedRes)
        } catch (e) {
          callback(statusCode, false)
        }
      }
    }
  }
  // send the payload as JSON
  const payloadStr = JSON.stringify(payload)
  xhr.send(payloadStr)
}

// Bind the forms
app.bindForms = function () {
    document.querySelector("form").addEventListener("submit", function (e) {
        // Stop it from submitting
        e.preventDefault();
        const formId = this.id;
        const path = this.action;
        const method = this.method.toUpperCase();
    
        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'hidden';
    
        // Turn the inputs into a payload
        const payload = {};
        const elements = this.elements;
        for(let i = 0; i < elements.length; i++){
            if(elements[i].type !== 'submit'){
            const valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
            payload[elements[i].name] = valueOfElement;
            }
        }
    
        // Call the API
        app.client.request(undefined,path,method,undefined,payload,function(statusCode,responsePayload){
            // Display an error on the form if needed
            if(statusCode !== 200){
    
            // Try to get the error from the api, or set a default error message
            const error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';
    
            // Set the formError field with the error text
            document.querySelector("#"+formId+" .formError").innerHTML = error;
    
            // Show (unhide) the form error field on the form
            document.querySelector("#"+formId+" .formError").style.display = 'block';
    
            } else {
            // If successful, send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
            }
    
        });
    });
};
  
  // Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
    const functionToCall = false;
    if(formId == 'accountCreate'){
        // @TODO Do something here now that the account has been created successfully
    }
};
  
// Init (bootstrapping)
app.init = function(){
    // Bind all form submissions
    app.bindForms();
};
  
// Call the init processes after the window loads
window.onload = function(){
    app.init();
};

