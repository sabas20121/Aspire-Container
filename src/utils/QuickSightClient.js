const AWS = require('aws-sdk');
const quicksightTemplate = require('../conf/quicksight-2018-04-01.min.json');

class QuickSightClient {
    constructor(region) {
        this.quicksightClient = new AWS.QuickSight({
            region: region,
            apiConfig: quicksightTemplate
        });
    }

    get client() {
        return this.quicksightClient;
    }
}

module.exports = QuickSightClient;

