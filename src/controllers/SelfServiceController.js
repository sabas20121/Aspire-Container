
const QuickSightService = require('../service/QuickSightService');

async function generateSelfServiceURL(req, res) {
    const { openIdToken } = req.body;

    try {
        const response = await QuickSightService.generateSelfServiceURLForRegisteredUser(openIdToken);

        res.json({
            status: 200,
            body: {
                DashboardURL: response,
            }
        });
    } catch (err) {
        console.error('Error generating QuickSight Self-Service URL:', err);
        res.status(500).json({ error: 'Error generating QuickSight Self-Service URL' });
    }
}

module.exports = {
    generateSelfServiceURL,
};
