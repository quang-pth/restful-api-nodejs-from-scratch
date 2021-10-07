/**
 * async hook example
 */

const async_hooks = require('async_hooks');
const fs = require('fs');

// target execution context
let targetExecutionContext = false;


// write an arbitatry async func
const whatTimeIsIt = function (callback) {
    setInterval(function () {
        fs.writeSync(1, "When the setInterval runs, the execution context is "
            + async_hooks.executionAsyncId() + "\n");
        callback(Date.now())
    }, 1000);
}

// call the function
whatTimeIsIt(function (time) {
    fs.writeSync(1, "The time is " + time + "\n");
});

// Hooks
const hooks = {
    init(asyncId, type, triggerAsyncId, resource) {
        fs.writeSync(1, "Hook init " + asyncId + "\n");
    },
    before(asyncId) {
        fs.writeSync(1, "Hook before " + asyncId + "\n");
    },
    after(asyncId) {
        fs.writeSync(1, "Hook after " + asyncId + "\n");
    },
    destroy(asyncId) {
        fs.writeSync(1, "Hook destroy " + asyncId + "\n");
    },
    promiseResolve(asyncId) {
        fs.writeSync(1, "Hook promiseResolve " + asyncId + "\n");
    }
}

// creata a new AsyncHooks instance
const asyncHooks = async_hooks.createHook(hooks);
asyncHooks.enable();




