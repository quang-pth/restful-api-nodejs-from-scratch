/**
 * Library that demonstrates something throwing when it's init() is called
 */

// container for the module
const example = {};

// init function
example.init = function () {
    // this is an error created intentionally (bar is not defined)
    const foo = bar;
}

// export the module
module.exports = example;