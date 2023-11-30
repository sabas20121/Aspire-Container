
const CognitoService = require('../service/CognitoService');

async function getIdToken(req, res) {
    const { code,redirectUrl } = req.body;

    try {
        const getIdToken = await CognitoService.getIdToken(code, redirectUrl);
        if (getIdToken && getIdToken.OpenIdToken && getIdToken.AccessToken && getIdToken.RefreshToken) {
            res.json({
                status: 200,
                body: {
                    OpenIdToken: getIdToken.OpenIdToken,
                    AccessToken: getIdToken.AccessToken,
                    RefreshToken:getIdToken.RefreshToken,
                }
            });
        }

    } catch (err) {
        console.error('Error fetching IdToken:', err);
        res.status(500).json({ error: 'Error fetching IdToken.' });
    }
}

module.exports = {
    getIdToken,
};
