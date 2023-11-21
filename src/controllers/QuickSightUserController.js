
const QuickSightService = require('../service/QuickSightService');

async function getUserDetails(req, res) {
    const { openIdToken } = req.body;

    try {
        const describeUserResponse = await QuickSightService.searchUserInQuickSight(openIdToken, res);
        if (describeUserResponse && describeUserResponse.user && describeUserResponse.message) {
            const describeUser = describeUserResponse.user;
            res.json({
                status: 200,
                message: describeUserResponse.message,
                body: {
                    UserDetails: describeUser,
                }
            });
        }

    } catch (err) {
        console.error('Error describing QuickSight user:', err);
        res.status(500).json({ error: 'Error describing QuickSight user.' });
    }
}

module.exports = {
    getUserDetails,
};
