const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const MetaData = require('../conf/MetaData.json');
const quicksightTemplate = require('../conf/quicksight-2018-04-01.min.json');
const QuickSightClient = require('../utils/QuickSightClient');
const QuickSightUserRegistrationClient = require('../utils/QuickSightUserRegistrationClient');
const awsAccountId = MetaData.QSConfiguration.awsAccountId;
const allowedDomains = MetaData.QSConfiguration.AllowedDomainList;
const identityRegion = MetaData.QSConfiguration.identityRegion;
const dashboardRegion = MetaData.QSConfiguration.dashboardRegion;
const groupName = MetaData.QSConfiguration.groupName;
const namespace = MetaData.QSConfiguration.namespace;
const identityType = MetaData.QSConfiguration.identityType;
const externalLoginFederationProviderType = MetaData.QSConfiguration.externalLoginFederationProviderType;
const roleArn = MetaData.QSConfiguration.roleArn;
const roleName = roleArn.split('/')[1];

const quickSightClient = new QuickSightClient(dashboardRegion);

async function searchDashboards(openIdToken) {
    const decodedToken = jwt_decode(openIdToken);
    let userName = decodedToken["cognito:username"];
    const userEmail = decodedToken["email"];
    const sessionName = userEmail;
    const clientId = decodedToken["aud"];
    // const namespace = clientId;

    const userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${sessionName}`;

    const dashboardFilters = [
        {
            Operator: 'StringEquals',
            Name: 'QUICKSIGHT_USER',
            Value: userArn,
        },
    ];

    try {
        const dashboardListResponse = await quickSightClient.client.searchDashboards({
            AwsAccountId: awsAccountId,
            MaxResults: 100,
            Filters: dashboardFilters,
        }).promise();

        const dashboardList = dashboardListResponse.DashboardSummaryList;
        return dashboardList;

    } catch (err) {
        console.error("Error retrieving dashboard List:: ", err)
        throw err;
    }
}

async function generateDashboardURLForRegisteredUser(openIdToken) {

    const decodedToken = jwt_decode(openIdToken);
    let userName = decodedToken["cognito:username"];
    const userEmail = decodedToken["email"];
    const sessionName = userEmail;
    const clientId = decodedToken["aud"];
    // const namespace = clientId;

    const userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${sessionName}`;


    try {
        const dashboardLURL = await quickSightClient.client.generateEmbedUrlForRegisteredUser({
            AwsAccountId: awsAccountId,
            ExperienceConfiguration: { 'Dashboard': { 'InitialDashboardId': 'non-existent-id' } },
            UserArn: userArn,
            AllowedDomains: allowedDomains,
            SessionLifetimeInMinutes: 60,
        }).promise();

        return dashboardLURL;
    } catch (err) {
        console.error("error:: ", err)
        throw err;
    }
}

async function generateSelfServiceURLForRegisteredUser(openIdToken) {

    const decodedToken = jwt_decode(openIdToken);
    let userName = decodedToken["cognito:username"];
    const userEmail = decodedToken["email"];
    const sessionName = userEmail;
    const clientId = decodedToken["aud"];
    // const namespace = clientId;

    const userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${sessionName}`;

    try {
        const selfServiceURL = await quickSightClient.client.generateEmbedUrlForRegisteredUser({
            AwsAccountId: awsAccountId,
            ExperienceConfiguration: { 'QuickSightConsole': { 'InitialPath': '/start/favorites' } },
            UserArn: userArn,
            AllowedDomains: allowedDomains,
            SessionLifetimeInMinutes: 60,
        }).promise();

        return selfServiceURL;
    } catch (err) {
        console.error("error:: ", err)
        throw err;
    }
}

async function generateAskMeURLForRegisteredUser(openIdToken) {

    const decodedToken = jwt_decode(openIdToken);
    let userName = decodedToken["cognito:username"];
    const userEmail = decodedToken["email"];
    const sessionName = userEmail;
    const clientId = decodedToken["aud"];
    // const namespace = clientId;

    const userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${sessionName}`;

    try {
        const askMeURL = await quickSightClient.client.generateEmbedUrlForRegisteredUser({
            AwsAccountId: awsAccountId,
            ExperienceConfiguration: { 'QSearchBar': {} },
            UserArn: userArn,
            AllowedDomains: allowedDomains,
            SessionLifetimeInMinutes: 60,
        }).promise();

        return askMeURL;
    } catch (err) {
        console.error("error:: ", err)
        throw err;
    }
}

async function searchUserInQuickSight(openIdToken) {
    return new Promise((resolve, reject) => {
        const decodedToken = jwt_decode(openIdToken);
        const userName = decodedToken["cognito:username"];
        const clientId = decodedToken["aud"];
        // const namespace = clientId;
        const userEmail = decodedToken["email"];
        const sessionName = userEmail;
        const roleName = roleArn.split('/')[1];
        const userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${sessionName}`;
        const quicksightUserName = `${roleName}/${sessionName}`;

        const quickSightUserRegistrationClient = new AWS.QuickSight({
            region: identityRegion,
            apiConfig: quicksightTemplate
        });
        // const quickSightUserRegistrationClient = new QuickSightUserRegistrationClient(identityRegion);

        // quickSightUserRegistrationClient.client.describeUser({
        quickSightUserRegistrationClient.describeUser({
            AwsAccountId: awsAccountId,
            Namespace: namespace,
            UserName: quicksightUserName,
        }, (err, userResponse) => {
            if (err) {
                if (err.code === 'ResourceNotFoundException') {
                    console.error("User not registered in QuickSight.");
                    registerUserAndAddToGroup(quicksightUserName, openIdToken, quickSightUserRegistrationClient)
                        .then(resolve)
                        .catch(reject);
                } else {
                    console.error("Error describe QuickSight user:", err);
                    reject(err);
                }
            } else {
                console.log("User exists in QuickSight.");
                resolve({ success: true, message: "User exists in QuickSight", user: userResponse.User });
            }
        });
    });
}

async function registerUserAndAddToGroup(quicksightUserName, openIdToken, quickSightUserRegistrationClient) {
    return new Promise(async (resolve, reject) => {
        try {
            const registrationResponse = await registerQuickSightUser(openIdToken, quickSightUserRegistrationClient);

            const userName = registrationResponse.user.UserName;

            quickSightUserRegistrationClient.createGroupMembership({
                AwsAccountId: awsAccountId,
                Namespace: namespace,
                MemberName: quicksightUserName,
                GroupName: groupName
            }, (err, groupMembershipResponse) => {
                if (err) {
                    console.error("Error while adding QuickSight user to Group: ", err);
                    reject(err);
                } else {
                    console.log("User registered and added to group successfully.");
                    resolve({ success: true, message: "User registered and added to group successfully.", user: groupMembershipResponse });
                }
            });
        } catch (err) {
            console.error("Error registering user and adding to group:", err);
            reject(err);
        }
    });
}

async function registerQuickSightUser(openIdToken, quickSightUserRegistrationClient) {
    return new Promise((resolve, reject) => {
        let userRole = 'READER'; // (READER, AUTHOR, or ADMIN)

        const decodedToken = jwt_decode(openIdToken);

        const userName = decodedToken["cognito:username"];
        const userEmail = decodedToken["email"];
        const webIdentityProvider = decodedToken["iss"];
        const webIdentitySubject = decodedToken["sub"];
        const clientId = decodedToken["aud"];
        // const namespace = clientId;
        const sessionName = userEmail;
        const roleName = roleArn.split('/')[1];
        const userArn = `arn:aws:quicksight:${identityRegion}:${awsAccountId}:user/${namespace}/${roleName}/${sessionName}`;

        quickSightUserRegistrationClient.registerUser({
            AwsAccountId: awsAccountId,
            Namespace: namespace,
            Email: userEmail,
            UserRole: userRole,
            IdentityType: identityType,
            IamArn: roleArn,
            SessionName: sessionName,
            ExternalLoginFederationProviderType: externalLoginFederationProviderType,
            CustomFederationProviderUrl: webIdentityProvider,
            ExternalLoginId: webIdentitySubject,
        }, (err, createUserResponse) => {
            if (err) {
                console.error("Error registring QuickSight user: ", err);
                reject(err);
            } else {
                console.log("User registration initiated in QuickSight.");
                resolve({ success: true, message: "User registration initiated in QuickSight.", user: createUserResponse.User });
            }
        });
    });
}


module.exports = {
    searchDashboards,
    generateDashboardURLForRegisteredUser,
    generateSelfServiceURLForRegisteredUser,
    generateAskMeURLForRegisteredUser,
    searchUserInQuickSight
};
