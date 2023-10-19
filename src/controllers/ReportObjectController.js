const S3Service = require('../service/S3Service');

async function getReportObject(req, res) {
  const { bucketName, path, fileName, s3Region } = req.body;

  try {
    const response = await S3Service.getObject({ bucketName, path, fileName, s3Region });

    res.json(response);
  } catch (err) {
    console.error('Error geting response from s3:', err);
    res.status(500).json({ error: 'Error geting response from S3' });
  }
}

module.exports = {
  getReportObject,
};