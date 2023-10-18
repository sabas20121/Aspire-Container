const AWS = require('aws-sdk');
const quicksightTemplate = require('../conf/quicksight-2018-04-01.min.json');

function QuickSightClient(region) {
    if (QuickSightClient.instances && QuickSightClient.instances[region]) {
        return QuickSightClient.instances[region];
    }

    this.region = region;

    this.quicksightClient = new AWS.QuickSight({
        region: this.region,
        apiConfig: quicksightTemplate,
    });

    if (!QuickSightClient.instances) {
        QuickSightClient.instances = {};
    }

    QuickSightClient.instances[region] = this;

    return QuickSightClient.instances[region];
}

QuickSightClient.getClient = function (region) {
    if (!QuickSightClient.instances || !QuickSightClient.instances[region]) {
        return null;
    }
    return QuickSightClient.instances[region].quicksightClient;
};

module.exports = QuickSightClient;
