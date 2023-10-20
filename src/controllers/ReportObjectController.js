const S3Service = require('../service/S3Service');

async function getReportObject(req, res) {
  const { tenantId, fileName } = req.body;

  try {
    const response = await S3Service.getObject({ fileName });

    res.json(response);
  } catch (err) {
    console.error('Error geting response from s3:', err);
    res.status(500).json({ error: 'Error geting response from S3' });
  }
}

module.exports = {
  getReportObject,
};