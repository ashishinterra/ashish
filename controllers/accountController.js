const uuid = require('uuid');
const validator = require('validator');
const _ = require('lodash');

const dynamoDb = require('../db/dynamodb');
//Custom Error imports
const EmailIdNotFound = require('../error/EmailIdNotFound');
const SerialNumberNotFound = require('../error/SerialNumberNotFound');
const AddressNotFound = require('../error/AddressNotFound');
const AccountCreationError = require('../error/AccountCreationError');
const AccountNotFound = require('../error/AccountNotFound');

module.exports.registerAccount = (req, res, next) => {
    console.log('>>>registerAccount');
    const timestamp = new Date().getTime();
    const data = req.body;
    // Request Validation
    if (_.isEmpty(data.emailId)) {
        throw new EmailIdNotFound('emailId cannot be empty');
    } else if (!validator.isEmail(data.emailId)) {
        throw new EmailIdNotFound('emailId is not correct');
    } else if (_.isEmpty(data.deviceSerialNumber)) {
        throw new SerialNumberNotFound('Device Serial Number cannot be empty');
    } else if (_.isEmpty(data.address) || _.isEmpty(data.city) || _.isEmpty(data.state) ||
        _.isEmpty(data.country) || _.isEmpty(data.zip)) {
        throw new AddressNotFound('address, city ,state, country and zip cannot be empty');
    } else {
        console.log('request verified');
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
                isActive: true,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        };
        const account = {
            "id": params.Item.id,
            'emailId': params.Item.emailId,
            "deviceSerialNumber": params.Item.deviceSerialNumber,
            "address": params.Item.address,
            "city": params.Item.city,
            "state": params.Item.state,
            "country": params.Item.country,
            "zip": params.Item.zip,
            "isActive": true,
            "createdAt": params.Item.createdAt,
            "updatedAt": params.Item.updatedAt
        };

        console.log('account >> ', account);
        console.log('adding data to dynamodb');
        dynamoDb.put(params, (error, result) => {
            if (error) {
                console.error(error);
                throw new AccountCreationError('Something went wrong. Please try again.');
            }
            res.status(200).json({
                success: true,
                account: account
            });
        });
    }
};


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
    };

    dynamoDb.query(params, (error, result) => {
        if (error) {
            console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
            throw new AccountNotFound('Something went wrong. Please try again.');
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
};

module.exports.updateAccount = (req, res) => {
    console.log('>>>updateAccount');
    const timestamp = new Date().getTime();
    console.log(req);
    const data = req.body;
    const id = req.params.id;
    console.log(data);
    if (_.isEmpty(data.deviceSerialNumber)) {
        throw new SerialNumberNotFound('Device Serial Number cannot be empty');
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
        };

        console.log('adding data to dynamodb');
        dynamoDb.update(params, (error, result) => {
            if (error) {
                console.error(error);
                throw new AccountNotFound('Something went wrong. Please try again.');
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
};