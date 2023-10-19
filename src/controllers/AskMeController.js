
const QuickSightService = require('../service/QuickSightService');

async function generateAskMeURL(req, res) {
    const { openIdToken } = req.body;

    try {
        const response = await QuickSightService.generateAskMeURLForRegisteredUser(openIdToken);

        res.json(response);
    } catch (err) {
        console.error('Error generating QuickSight Ask-Me URL:', err);
        res.status(500).json({ error: 'Error generating QuickSight Ask-Me URL' });
    }
}

module.exports = {
    generateAskMeURL,
};
