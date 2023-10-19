const { S3Client } = require("@aws-sdk/client-s3");

class AWSS3Client {
    constructor(region) {
        const awsConfig = {
            region: region,
        };
        this.s3Client = new S3Client(awsConfig);
    }

    get client() {
        return this.s3Client;
    }
}

module.exports = AWSS3Client;

