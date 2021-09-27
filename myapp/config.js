/**
 * Create and Export configuration variables
 * 
 */

// container for all the enviroments
const enviroments = {};

// staging {default} environment
enviroments.staging = {
    'port': 3000,
    'envName': 'staging',
};


// production enviroment
enviroments.production = {
    'port': 5000,
    'envName': 'production',
};

// determine which enviroment was passed as a command-line argument
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current enviroment is one of the enviroments above, if not, default to staging
const envToExport = typeof(enviroments[currentEnv]) == 'object' ? enviroments[currentEnv] : enviroments.staging;

// export the module
module.exports = envToExport;





