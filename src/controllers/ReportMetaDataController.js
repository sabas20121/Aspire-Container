// const reportMetaData = require('../../reports_details/ReportMetaData.json');
const reportMetaData = require("../conf/ReportMetaData.json");

async function getReportMetaData(req, res) {

    try {
        res.json({
            status: 200,
            body: {
                reportMetaData: reportMetaData,
            }
        });
    } catch (err) {
        console.error('Error getting Report Meta Data:', err);
        res.status(500).json({ error: 'Error getting  Report Meta Data' });
    }
}

module.exports = {
    getReportMetaData,
};
