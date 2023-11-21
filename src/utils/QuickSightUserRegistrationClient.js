const AWS = require('aws-sdk');
const quicksightTemplate = require('../conf/quicksight-2018-04-01.min.json');

class QuickSightUserRegistrationClient {
    constructor(region) {
        this.quickSightUserRegistrationClient = new AWS.QuickSight({
            region: region,
            apiConfig: quicksightTemplate
        });
    }

    get client() {
        return this.quickSightUserRegistrationClient;
    }
}

module.exports = QuickSightUserRegistrationClient;

