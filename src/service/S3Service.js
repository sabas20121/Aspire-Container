const { GetObjectCommand } = require("@aws-sdk/client-s3");
const csv = require('csv-parser');
const { Readable } = require('stream');
const AWSS3Client = require('../utils/S3Client');

async function getObject(bucketName, path, fileName, s3Region) {
    // const { bucketName, path, fileName, s3Region } = req.body;
    const s3Client = new AWSS3Client(s3Region);

    try {
        const getObjectParams = {
            Bucket: bucketName,
            Key: `${path}/${fileName}`,
        };

        const getObject = new GetObjectCommand(getObjectParams);
        const data = await s3Client.client.send(getObject);

        const csvContent = data.Body.toString();

        const results = await new Promise((resolve) => {
            const results = [];
            const csvStream = new Readable({
                read() {
                    this.push(csvContent);
                    this.push(null);
                },
            });

            csvStream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                });
        });

        return results;
    } catch (err) {
        console.error("Error: ", err);
        throw err;
    }
}

module.exports = {
    getObject
};
