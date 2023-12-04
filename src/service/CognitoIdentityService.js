const MetaData = require('../conf/MetaData.json');
const AWS = require('aws-sdk');

const cognitoIdentityRegion = MetaData.ClientDetails.cognitoIdentityRegion;


AWS.config.update({
    region: cognitoIdentityRegion
  });

async function getIdToken(code, redirectUrl) {
    try {
        const payload = {
            grant_type: 'authorization_code',
            client_id: MetaData.ClientDetails.cognitoClientId,
            code: code,
            redirect_uri: redirectUrl,
        };

        const tokenEndpoint = `${MetaData.ClientDetails.cognitoDomainUrl}/oauth2/token`;

        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.keys(payload)
                .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]))
                .join('&'),
        });

        if (!response.ok) {
            console.error("!response.ok::", response);
        }

        const tokenData = await response.json();

        if (tokenData) {
            return tokenData;
        }

    } catch (err) {
        console.error("Error: ", err);
        throw err;
    }
}

async function getIdentityId(identityToken) {
    try {

        const accountId = MetaData.QSConfiguration.awsAccountId;
        const cognitoIdentityPoolId = MetaData.ClientDetails.cognitoIdentityPoolId;
        const cognitoUserPoolId = MetaData.ClientDetails.cognitoUserPoolId

        const cognitoIdp =   `cognito-idp.${cognitoIdentityRegion}.amazonaws.com/${cognitoUserPoolId}`;

        const logins = {
            [cognitoIdp]: identityToken,
        }

        const params = {
            AccountId: accountId,
            IdentityPoolId: cognitoIdentityPoolId,
            Logins: logins
        };

        const cognitoIdentity = new AWS.CognitoIdentity();

        const data = await cognitoIdentity.getId(params).promise();
        console.log('Success:', data);
        return data;

    } catch (err) {
        console.error("Error: ", err);
        throw err;
    }
}

module.exports = {
    getIdToken,
    getIdentityId
};
