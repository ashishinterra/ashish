const uuid = require('uuid');
const dynamoDb = require('../db/dynamodb');

module.exports.registerAccount = (event, context, callback) => {
    console.log('>>>registerAccount');
    const timestamp = new Date().getTime();
    console.log(event);
    console.log(event.body);
    const data = event.body;
    console.log(data);
    console.log(data.emailId);

    const params = {
        TableName: 'account',
        Item: {
            id: uuid.v1(),
            emailId: data.emailId,
            deviceSerialNumber: data.deviceSerialNumber,
            homeAddr: data.homeAddr,
            role: 'owner',
            createdAt: timestamp,
            updatedAt: timestamp
        }
    }

    console.log('adding data to dynamodb');
    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(error);
            return error;
        }
        console.log('result', result);
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(params.Item)
        }
        console.log('response', response);
        callback(null, response);
    })
}