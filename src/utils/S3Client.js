const AWS = require('aws-sdk');

class AWSS3Client {
    constructor(region) {
        AWS.config.update({ region: region });
        this.s3Client = new AWS.S3();
    }

    get client() {
        return this.s3Client;
    }
}

module.exports = AWSS3Client;