const { GetObjectCommand } = require("@aws-sdk/client-s3");
const csv = require('csv-parser');
const { Readable } = require('stream');
const AWSS3Client = require('../utils/S3Client');
const MetaData = require('../../MetaData.json');
const bucketName = MetaData.S3Configuration.bucketName;
const s3Region = MetaData.S3Configuration.s3Region;

const s3Client = new AWSS3Client(s3Region);

async function getObject( fileName ) {

    try {
        const getObjectParams = {
            Bucket: bucketName,
            Key: fileName,
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
