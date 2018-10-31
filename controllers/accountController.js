const uuid = require('uuid');
const dynamoDb = require('../db/dynamodb');

module.exports.registerAccount = (req, res) => {
    console.log('>>>registerAccount');
    const timestamp = new Date().getTime();
    console.log(req);
    console.log(req.body);
    const data = req.body;
    console.log(data);
    console.log(data.emailId);

    const params = {
        TableName: 'account',
        Item: {
            id: uuid.v1(),
            emailId: data.emailId,
            deviceSerialNumber: data.deviceSerialNumber,
            homeAddr: data.homeAddr,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    }

    console.log('adding data to dynamodb');
    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            res.status(400).json({
                success: false,
                message: error
            });
        }
        res.status(200).json({
            success: true
        });
    });
}


module.exports.getAccount = (req, res) => {
    console.log('>>>getAccount', req);
    var params = {
        TableName: 'account'
    }

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
            res.status(400).json({
                success: false,
                message: error
            });
        } else {
            console.log("Query succeeded.");
            console.log("Query succeeded." + JSON.stringify(result));
            result.Items.forEach(function (item) {
                console.log(" Item :: ", JSON.stringify(item));
            });
            res.status(200).json({
                success: true,
                accounts: result.Items
            });
        }
    });
}

module.exports.updateAccount = (req, res) => {
    console.log('>>>updateAccount');
    const timestamp = new Date().getTime();
    console.log(req);
    console.log(req.body);
    const data = req.body;
    const id = req.params.id;
    console.log(data);
    console.log(data.emailId);

    const params = {
        TableName: 'account',
        Item: {
            id: id,
            emailId: data.emailId,
            deviceSerialNumber: data.deviceSerialNumber,
            homeAddr: data.homeAddr,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    }

    console.log('adding data to dynamodb');
    dynamoDb.update(params, (error, result) => {
        if (error) {
            console.error(error);
            res.status(400).json({
                success: false,
                message: error
            });
        }
        if (result) {
            console.log('result', JSON.stringify(result));
        }
        console.log('params', params.item);
        res.status(200).send(params.item);
    });
}