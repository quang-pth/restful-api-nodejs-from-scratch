/**
 * Example VM
 * Running some arbitrary commands
 */

const vm = require('vm');

// define a context for the script to run in
const context = {
    'foo': 25
};

// define a script that should execute
const script = new vm.Script(`
    foo = foo * 2;
    var bar = foo + 1;
    var fizz = 52;
`);

// Run the script
script.runInNewContext(context);
console.log(context);