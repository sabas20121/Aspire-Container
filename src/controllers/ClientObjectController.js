const MetaData = require("../conf/MetaData.json");

async function getClientObject(req, res) {
    const { requestedObject } = req.body;

    try {
        if (MetaData[requestedObject]) {
            const result = MetaData[requestedObject];
            res.json(result);
        } else {
            res.status(404).json({ error: `Requested object "${requestedObject}" not found in MetaData` });
        }
    } catch (err) {
        console.error('Error getting Report Meta Data:', err);
        res.status(500).json({ error: 'Error getting Report Meta Data' });
    }
}

module.exports = {
    getClientObject,
};
