
const CognitoIdentityService = require('../service/CognitoIdentityService');

async function getIdToken(req, res) {
    const { code,redirectUrl } = req.body;

    try {
        const getTokenResponse = await CognitoIdentityService.getIdToken(code, redirectUrl);
        if (getTokenResponse ) {
            res.json({
                status: 200,
                data: getTokenResponse
            });
        }

    } catch (err) {
        console.error('Error fetching IdToken:', err);
        res.status(500).json({ error: 'Error fetching IdToken.' });
    }
}

async function getIdentityId(req, res) {
    const { identityToken } = req.body;

    try {
        const IdentityId = await CognitoIdentityService.getIdentityId(identityToken);
        if (IdentityId ) {
            res.json({
                status: 200,
                body: {
                    IdentityId: IdentityId,
                }
            });
        }

    } catch (err) {
        console.error('Error fetching IdentityId:', err);
        res.status(500).json({ error: 'Error fetching IdentityId.' });
    }
}

module.exports = {
    getIdToken,
    getIdentityId
};
