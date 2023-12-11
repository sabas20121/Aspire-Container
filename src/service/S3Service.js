const AWSS3Client = require('../utils/S3Client');
const MetaData = require('../conf/MetaData.json');

const bucketName = MetaData.S3Configuration.bucketName;
const s3Region = MetaData.S3Configuration.s3Region;

const s3Client = new AWSS3Client(s3Region);

async function getObject(fileName) {
    return new Promise((resolve, reject) => {
        s3Client.client.getObject({
            Bucket: bucketName,
            Key: fileName.S3Key
        }, (err, data) => {
            if (err) return reject(err);
            try {
                const bodyString = data.Body.toString('utf8');
                const obj = JSON.parse(bodyString);
                resolve(obj);
            } catch (e) {
                reject(e);
            }
        });
    });
}

module.exports = {
    getObject
};