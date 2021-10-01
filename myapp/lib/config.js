/**
 * Create and Export configuration variables
 * 
 */

// container for all the enviroments
const enviroments = {};

// staging {default} environment
enviroments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC9f085e2f80f48ffffdb61bb3d1542a72',
        'authToken': 'e2e71530ddb972e6c7b6ac23e246e7a3',
        'fromPhone': '+18565224686'
    },
    'templateGlobals': {
        'appName': 'UptimerChecker',
        'companyName': 'NotRealCompany, Inc',
        'yearCreated': '2021',
        'baseUrl': 'http://localhost:3000/'
    }
};


// production enviroment
enviroments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC9f085e2f80f48ffffdb61bb3d1542a72',
        'authToken': 'e2e71530ddb972e6c7b6ac23e246e7a3',
        'fromPhone': '+18565224686'
    },
    'templateGlobals': {
        'appName': 'UptimerChecker',
        'companyName': 'NotRealCompany, Inc',
        'yearCreated': '2021',
        'baseUrl': 'https://localhost:3000/'
    }
};

// determine which enviroment was passed as a command-line argument
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current enviroment is one of the enviroments above, if not, default to staging
const envToExport = typeof(enviroments[currentEnv]) == 'object' ? enviroments[currentEnv] : enviroments.staging;

// export the module
module.exports = envToExport;





