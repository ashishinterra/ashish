const uuid = require('uuid');
const validator = require('validator');
const _ = require('lodash');

const dynamoDb = require('../db/dynamodb');

module.exports.registerAccount = (req, res) => {
    console.log('>>>registerAccount');
    const timestamp = new Date().getTime();
    console.log(req);
    console.log(req.body);
    const data = req.body;
    console.log(data);
    console.log(data.emailId);

    if (_.isEmpty(data.emailId)) {
        res.status(400).send({
            success: false,
            message: 'emailId cannot be empty.'
        });
    } else if (!validator.isEmail(data.emailId)) {
        res.status(400).send({
            success: false,
            message: 'emailId is not correct'
        });
    } else if (_.isEmpty(data.deviceSerialNumber)) {
        res.status(400).send({
            success: false,
            message: 'device Serial Number cannot be empty.'
        });
    } else if (_.isEmpty(data.address) || _.isEmpty(data.city) || _.isEmpty(data.state) ||
        _.isEmpty(data.country) || _.isEmpty(data.zip)) {
        res.status(400).send({
            success: false,
            message: 'address, city ,state, country and zip cannot be empty.'
        });
    } else {
        console.log('request body verified');
        const params = {
            TableName: 'account',
            Item: {
                id: uuid.v1(),
                emailId: data.emailId,
                deviceSerialNumber: data.deviceSerialNumber,
                address: data.address,
                country: data.country,
                state: data.state,
                city: data.city,
                zip: data.zip,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        }
        const account = {
            "id": params.Item.id,
            'emailId': params.Item.emailId,
            "deviceSerialNumber": params.Item.deviceSerialNumber,
            "address": params.Item.address,
            "city": params.Item.city,
            "state": params.Item.state,
            "country": params.Item.country,
            "zip": params.Item.zip,
            "createdAt": params.Item.createdAt,
            "updatedAt": params.Item.updatedAt
        }
        console.log('account >> ', account);
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
                success: true,
                account: account
            });
        });
    }
}


module.exports.getAccount = (req, res) => {
    console.log('>>>getAccount', req);
    const accountId = req.params.id;
    console.log('accountId==>' + accountId);
        var params = {
            TableName: 'account',
            KeyConditionExpression: "#id = :accountId",
            ExpressionAttributeNames: {
                "#id": "id"
            },
            ExpressionAttributeValues: {
                ":accountId": accountId
            }
        }

        dynamoDb.query(params, (error, result) => {
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
                    account: result.Items
                });
            }
        });
    }

module.exports.updateAccount = (req, res) => {
    console.log('>>>updateAccount');
    const timestamp = new Date().getTime();
    console.log(req);
    const data = req.body;
    const id = req.params.id;
    console.log(data);
    if (_.isEmpty(data.deviceSerialNumber)) {
        res.status(400).send({
            success: false,
            message: 'device Serial Number cannot be empty.'
        });
    } else {
        const params = {
            TableName: 'account',
            Key: {
                id: id
            },
            UpdateExpression: "set deviceSerialNumber = :deviceSerialNumber",
            ExpressionAttributeValues: {
                ":deviceSerialNumber": data.deviceSerialNumber
            },
            ReturnValues: "UPDATED_NEW"
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
            res.status(200).json({
                success: true,
                message: "succesfully updated"
            });
        });
    }
}