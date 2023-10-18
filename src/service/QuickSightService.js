const jwt_decode = require('jwt-decode');
const MetaData = require('../../MetaData.json');
const QuickSightClient = require('../utils/QuickSightClient');

const awsAccountId = MetaData.QSConfiguration.awsAccountId;
const allowedDomains = MetaData.QSConfiguration.AllowedDomainList;
const identityRegion = MetaData.QSConfiguration.identityRegion;
const dashboardRegion = MetaData.QSConfiguration.dashboardRegion;
const namespace = MetaData.QSConfiguration.namespace;
const roleArn = MetaData.QSConfiguration.roleArn;
const roleName = roleArn.split('/')[1];

async function searchDashboards(openIdToken) {

    const decodedToken = jwt_decode(openIdToken);
    let userName = decodedToken["cognito:username"];

    let userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${userName}`;

    const dashboardFilters = [
        {
            Operator: 'StringEquals',
            Name: 'QUICKSIGHT_USER',
            Value: userArn,
        },
    ];

    try {
        const dashboardList = await QuickSightClient.getClient(dashboardRegion).searchDashboards({
            AwsAccountId: awsAccountId,
            MaxResults: 100,
            Filters: dashboardFilters,
        }).promise();

        return dashboardList.DashboardSummaryList;
    } catch (err) {
        throw err;
    }
}

async function generateDashboardURLForRegisteredUser(openIdToken) {

    const decodedToken = jwt_decode(openIdToken);
    let userName = decodedToken["cognito:username"];

    let userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${userName}`;


    try {
        const dashboardLURL = await QuickSightClient.getClient(dashboardRegion).generateEmbedUrlForRegisteredUser({
            AwsAccountId: awsAccountId,
            ExperienceConfiguration: { 'Dashboard': { 'InitialDashboardId': 'non-existent-id' } },
            UserArn: userArn,
            AllowedDomains: allowedDomains,
            SessionLifetimeInMinutes: 60,
        }).promise();

        return dashboardLURL;
    } catch (err) {
        throw err;
    }
}

async function generateSelfServiceURLForRegisteredUser(openIdToken) {

    const decodedToken = jwt_decode(openIdToken);
    let userName = decodedToken["cognito:username"];

    let userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${userName}`;

    try {
        const selfServiceURL = await QuickSightClient.getClient(dashboardRegion).generateEmbedUrlForRegisteredUser({
            AwsAccountId: awsAccountId,
            ExperienceConfiguration: { 'Dashboard': { 'InitialDashboardId': 'non-existent-id' } },
            UserArn: userArn,
            AllowedDomains: allowedDomains,
            SessionLifetimeInMinutes: 60,
        }).promise();

        return selfServiceURL;
    } catch (err) {
        throw err;
    }
}

async function generateAskMeURLForRegisteredUser(openIdToken) {

    const decodedToken = jwt_decode(openIdToken);
    let userName = decodedToken["cognito:username"];

    let userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${userName}`;

    try {
        const askMeURL = await QuickSightClient.getClient(dashboardRegion).generateEmbedUrlForRegisteredUser({
            AwsAccountId: awsAccountId,
            ExperienceConfiguration: { 'Dashboard': { 'InitialDashboardId': 'non-existent-id' } },
            UserArn: userArn,
            AllowedDomains: allowedDomains,
            SessionLifetimeInMinutes: 60,
        }).promise();

        return askMeURL;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    searchDashboards,
    generateDashboardURLForRegisteredUser,
    generateSelfServiceURLForRegisteredUser,
    generateAskMeURLForRegisteredUser
};
