const QuickSightService = require('../service/QuickSightService');

async function generateDashboardURL(req, res) {
    const { openIdToken } = req.body;

    try {
        const response = await QuickSightService.generateDashboardURLForRegisteredUser(openIdToken);

        res.json(response);
    } catch (err) {
        console.error('Error generating QuickSight Dashboard URL:', err);
        res.status(500).json({ error: 'Error generating QuickSight Dashboard URL' });
    }
}

module.exports = {
    generateDashboardURL,
};
