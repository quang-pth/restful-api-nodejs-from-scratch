/**
 * UNIT TESTS
 */

// dependencies
const helpers = require('./../lib/helpers');
const assert = require('assert');
const logs = require('./../lib/logs');
const exampleDebugginProblem = require('./../lib/exampleDebuggingProblem');

// holder for tests
const unit = {};

// assert that the getANumber function is ruturning a number
unit['helpers.getANumber should return number'] = function (done) {
    const val = helpers.getANumber();
    assert.equal(typeof(val), 'number');
    done();
};

// assert that the getANumber function is ruturning a 1
unit['helpers.getANumber should return 1'] = function (done) {
    const val = helpers.getANumber();
    assert.equal(val, 1);
    done();
};

// assert that the getANumber function is ruturning a 2
unit['helpers.getANumber should return 2'] = function (done) {
    const val = helpers.getANumber();
    assert.equal(val, 2);
    done();
};

// logs.list should callback an array and a false error
unit['logs.list should callback a false error and a array of log names'] = function (done) {
    logs.list(true, function (err, logFileNames) {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
};

// logs.truncate should not thrown if the logId does not exist
unit['logs.truncate should not throw if the logId does not exist. It should callback an error instead'] = function (done) {
    assert.doesNotThrow(function () {
        logs.truncate('I do no exist', function (err) {
            assert.ok(err);
            done();
        });
    }, TypeError);
}

// exampleDebugginProblem should not throw but it does
unit['exampleDebugginProblem.init should not throw when called'] = function (done) {
    assert.doesNotThrow(function () {
        exampleDebugginProblem.init();
        done();
    }, TypeError);
}



// export the unit tests
module.exports = unit;