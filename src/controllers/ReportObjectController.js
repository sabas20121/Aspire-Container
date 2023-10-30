const S3Service = require('../service/S3Service');

async function getReportObject(req, res) {
  const { S3Key } = req.body;

  try {
    const response = await S3Service.getObject({ S3Key });

    res.json(response);
  } catch (err) {
    console.error('Error geting response from s3:', err);
    res.status(500).json({ error: 'Error geting response from S3' });
  }
}

module.exports = {
  getReportObject,
};