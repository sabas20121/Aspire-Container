
const QuickSightService = require('../service/QuickSightService');

async function getDashboardList(req, res) {
    const { openIdToken } = req.body;

    try {
        const dashboardList = await QuickSightService.searchDashboards(openIdToken);

        res.json({
            status: 200,
            body: {
                DashboardList: dashboardList,
            }
        });
    } catch (err) {
        console.error('Error listing QuickSight Dashboards:', err);
        res.status(500).json({ error: 'Error listing QuickSight Dashboards' });
    }
}

module.exports = {
    getDashboardList,
};
