const fs = require('fs');
const AWS = require('aws-sdk');
// Enter copied or downloaded access ID and secret key here
const ID = '';
const SECRET = '';

// The name of the bucket that you have created
const BUCKET_NAME = 'test-bucket';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadFileOnS3 = (fileName: any) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    console.log("fileContent", fileContent)

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent
    };


    // Uploading files to the bucket
    s3.upload(params, function (err: Error, data: any) {
        if (err) {
            throw err;
        }
        return data.Location
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

module.exports = { uploadFileOnS3 }
