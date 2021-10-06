/**
 * This is the test runner
 */

// dependencies
const helpers = require('./../lib/helpers');
const assert = require('assert');


// Application logic for the test runner
_app = {};


// container for the test
_app.tests = {
    'unit': {}
};

// assert that the getANumber function is ruturning a number
_app.tests.unit['helpers.getANumber should return number'] = function (done) {
    const val = helpers.getANumber();
    assert.equal(typeof(val), 'number');
    done();
};

// assert that the getANumber function is ruturning a 1
_app.tests.unit['helpers.getANumber should return 1'] = function (done) {
    const val = helpers.getANumber();
    assert.equal(val, 1);
    done();
};

// assert that the getANumber function is ruturning a 2
_app.tests.unit['helpers.getANumber should return 2'] = function (done) {
    const val = helpers.getANumber();
    assert.equal(val, 2);
    done();
};

// count all the tests
_app.countTests = function () {
    let counter = 0;
    for (const key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            const subTest = _app.tests[key];
            for (const testName in subTest) {
                if (subTest.hasOwnProperty(testName)) counter++;
            }
        }
    }
    return counter;
}

// run all the tests, collecting the erros and successes
_app.runTests = function () {
    const errors = [];
    const limit = _app.countTests();
    let successes = 0;
    let counter = 0;
    
    for (const key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            const subTests = _app.tests[key];
            for (const testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    (function () {
                        const tmpTestName = testName;
                        const testValue = subTests[testName];
                        // call the test
                        try {
                            testValue(function () {
                                // if it callback withou throwing then it succeeded, so log it in green
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                                counter++;
                                successes++;
                                if (counter == limit) {
                                    _app.produceTestReport(limit, successes, errors);
                                }
                            })
                        } catch (e) {
                            // if it thrown, then it failed, so capture the error and log it in red
                            errors.push({
                                'name': testName,
                                'error': e
                            });
                            console.log('\x1b[31m%s\x1b[0m', tmpTestName);
                            counter++;
                            if (counter == limit) {
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    })();
                }
            }
        }
    }
}

// produce a test outcome reports
_app.produceTestReport = function (limit, successes, errors) {
    console.log("");
    console.log("--------------BEGIN TEST REPORT-----------------");
    console.log("");
    console.log("Total Tests: ", limit);
    console.log("Passes: ", successes);
    console.log("Fail: ", errors.length);

    // if there is any error print them in detail
    if (errors.length) {
        console.log('----------------BEGIN ERROR DETAILS-----------------');
        console.log("");
        
        errors.forEach(testError => {
            console.log('\x1b[31m%s\x1b[0m', testError.name);
            console.log(testError.error);
            console.log("");
        });
        
        console.log("");
        console.log('----------------END ERROR DETAILS-----------------');
    }
    
    console.log("");
    console.log('----------------END TEST REPORT-----------------');
}


// run the tests
_app.runTests();


