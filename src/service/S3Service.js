const { GetObjectCommand } = require("@aws-sdk/client-s3");
const csv = require('csv-parser');
const { Readable } = require('stream');
const AWSS3Client = require('../utils/S3Client');
const MetaData = require('../conf/MetaData.json');
const bucketName = MetaData.S3Configuration.bucketName;
const s3Region = MetaData.S3Configuration.s3Region;

const s3Client = new AWSS3Client(s3Region);

async function getObject(fileName) {
    try {
        const getObjectParams = {
            Bucket: bucketName,
            Key: fileName.S3Key,
        };
        const getObject = new GetObjectCommand(getObjectParams);

        const { Body } = await s3Client.client.send(getObject);

        const csvData = (await streamToPromise(Body)).toString('utf-8');

        const results = [];
        await new Promise((resolve, reject) => {
            const stream = Readable.from(csvData);
            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                })
                .on('error', reject);
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

function streamToPromise(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}
