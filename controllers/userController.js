const uuid = require('uuid');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
global.fetch = require('node-fetch');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require("bcryptjs");

const dynamoDb = require('../db/dynamodb');
const config = require('../config/aws.json');

const EmailIdNotFound = require('../error/EmailIdNotFound');
const AccountNotFound = require('../error/AccountNotFound');
const UsernameNotFound = require('../error/UsernameNotFound');
const PasswordNotFound = require('../error/PasswordNotFound');
const FirstNameNotFound = require('../error/FirstNameNotFound');
const RoleNotFound = require('../error/RoleNotFound');
const UserCreationError = require('../error/UserCreationError');
const UserNameAlreadyExists = require('../error/UserNameAlreadyExists');
const UserNotFound = require('../error/UserNotFound');
const VerifyUserError = require('../error/VerifyUserError');

module.exports.registerUser = (req, res) => {
    console.log('>>> Entering registerUser Function');
    const timestamp = new Date().getTime();
    const data = req.body;

    if (_.isEmpty(data.emailId)) {

        console.error('emailId cannot be empty');
        throw new EmailIdNotFound('emailId cannot be empty');

    } else if (!validator.isEmail(data.emailId)) {
        console.error('emailId is not correct');
        throw new EmailIdNotFound('emailId is not correct');

    } else if (_.isEmpty(data.accountId)) {

        console.error('accountId cannot be empty.');
        throw new AccountNotFound('accountId cannot be empty.');

    } else if (_.isEmpty(data.userName)) {

        console.error('userName cannot be empty.');
        throw new UsernameNotFound('userName cannot be empty.');

    } else if (_.isEmpty(data.password)) {

        console.error('password cannot be empty.');
        throw new PasswordNotFound('password cannot be empty.');

    } else if (_.isEmpty(data.firstName)) {

        console.error('firstName cannot be empty.');
        throw new FirstNameNotFound('firstName cannot be empty.');

    } else if (_.isEmpty(data.role)) {

        console.error('role cannot be empty.');
        throw new RoleNotFound('role cannot be empty.');

    } else {
        let isUserExist = false;
        const params = {
            TableName: 'user',
            KeyConditionExpression: "#uname = :username",
            ExpressionAttributeNames: {
                "#uname": "userName"
            },
            ExpressionAttributeValues: {
                ":username": body.userName
            }
        };

        dynamoDb.query(params, (error, result) => {
            if (error) {
                //to be changed
                console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
                throw new UserCreationError();
            } else {
                console.log("Query succeeded.");
                console.log("Query succeeded." + JSON.stringify(result));
                if (result.Items.length > 0) {
                    isUserExist = true;
                }
            }
        });
        if (!isUserExist) {
            // Aws congnito related logic
            const poolData = {
                UserPoolId: config.aws.UserPoolId,
                ClientId: config.aws.ClientId
            };
            const pool_region = config.aws.region;
            const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

            console.log("pool set up done. now setting up data to list ");
            let attributeList = [];
            attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "email",
                Value: data.emailId
            }));
            console.log("now signup congnito");

            userPool.signUp(data.emailId, data.password, attributeList, null, function (err, result) {
                if (err) {
                    console.error(err);
                    throw new UserCreationError();
                }
                cognitoUser = result.user;
                console.log('user name is ' + cognitoUser.getUsername());
                console.log("congnito signup end");

                // encrypt password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(data.password, salt, (err, hash) => {
                        data.password = hash;
                        next();
                    });
                });

                const params = {
                    TableName: 'user',
                    Item: {
                        emailId: data.emailId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        accountId: data.accountId,
                        userName: data.userName,
                        role: data.role,
                        mobileNumber: data.mobilenumber,
                        password: data.password,
                        isActive: true,
                        createdAt: timestamp,
                        updatedAt: timestamp
                    }
                };
                const user = {
                    'emailId': params.Item.emailId,
                    "firstName": params.Item.firstName,
                    "lastName": params.Item.lastName,
                    "userName": params.Item.userName,
                    "role": params.Item.role,
                    "accountId": params.Item.accountId,
                    "isActive": true,
                    "mobileNumber": params.Item.mobileNumber,
                    "createdAt": params.Item.createdAt,
                    "updatedAt": params.Item.updatedAt
                };
                console.log('adding user to dynamodb');
                dynamoDb.put(params, (error, result) => {
                    if (error) {
                        console.error(error);
                        throw new UserCreationError();
                    }
                    res.status(200).json({
                        success: true,
                        user: user
                    });
                });
            });
        } else {
            throw new UserNameAlreadyExists("UserName already exist");
        }
    }
};

module.exports.getUser = (req, res) => {
    console.log('>>>getUser', req);
    const userName = req.params.username;
    console.log('userName==>' + userName);

    var params = {
        TableName: 'user',
        KeyConditionExpression: "#uname = :username",
        ExpressionAttributeNames: {
            "#uname": "userName"
        },
        ExpressionAttributeValues: {
            ":username": userName
        }
    };

    dynamoDb.query(params, (error, result) => {
        if (error) {
            console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
            throw new UserNotFound();
        } else {
            console.log("Query succeeded.");
            console.log("Query succeeded." + JSON.stringify(result));
            let user;
            result.Items.forEach(function (item) {
                console.log(" Item :: ", JSON.stringify(item));
                user = item;
            });
            if (result && result.Items) {
                res.status(200).json({
                    success: true,
                    user: user
                });
            } else {
                console.log("No User found");
                throw new UserNotFound("No User found");
            }
        }
    });
};
module.exports.verifyUser = (req, res) => {
    console.log('>>>verifyUser');
    console.log('request body==>' + req.body);
    const data = req.body;
    console.log('data==>' + data);
    // Aws congnito related logic
    const poolData = {
        UserPoolId: config.aws.UserPoolId,
        ClientId: config.aws.ClientId
    };
    const pool_region = config.aws.region;
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: data.emailId,
        Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(data.pin, true, function (err, result) {
        if (err) {
            console.log(err);
            console.error('Could not verify account!');
            throw new VerifyUserError('Could not verify account!');
        }
        if (result == "SUCCESS") {
            console.log("Successfully verified account!");
            cognitoUser.signOut();
            res.status(200).json({
                success: true,
                message: "Successfully verified account!"
            });
        } else {
            console.error('Could not verify account!');
            throw new VerifyUserError('Could not verify account!');
        }
    });
};


module.exports.getUserByAccount = (req, res) => {
    console.log('>>>getUserByAccount ', req);
    const accountId = req.params.id;

    var params = {
        TableName: 'user',
        "FilterExpression": "accountId = :accountId",
        ExpressionAttributeValues: {
            ":accountId": accountId
        }
    };

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
            console.log("No User found");
            throw new UserNotFound("No User found");
        } else {
            console.log("Query succeeded.");
            console.log("Query succeeded." + JSON.stringify(result));
            if (result && result.Items) {
                res.status(200).json({
                    success: true,
                    user: result.Items
                });
            } else {
                console.log("No User found");
                throw new UserNotFound("No User found");
            }
        }
    });
};