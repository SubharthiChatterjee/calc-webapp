const AWS = require('aws-sdk')
const key = 'callogs.json'

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const params = {
    Key: key,
    Bucket: process.env.BUCKET_NAME
}

const getData = async () => {
    return await s3.getObject(params).promise()
    .then((data) => JSON.parse(data.Body))
    .catch((err) => {
        throw err
    });
}

const uploadData = async (data) => {
    const params = { Bucket: process.env.BUCKET_NAME, Key: key, Body: JSON.stringify(data, null, 2) };
    const options = { partSize: 10 * 1024 * 1024, queueSize: 3 };
    await s3.upload(params, options).promise()
        .then((data) => data.Body)
        .catch((err) => {
            throw err
        })
}

module.exports = {
    getData,
    uploadData
}