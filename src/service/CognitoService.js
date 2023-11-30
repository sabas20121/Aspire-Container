const MetaData = require('../conf/MetaData.json');

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

module.exports = {
    getIdToken
};
