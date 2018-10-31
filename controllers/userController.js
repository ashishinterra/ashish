const uuid = require('uuid');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
global.fetch = require('node-fetch');

const dynamoDb = require('../db/dynamodb');
const config = require('../config/aws.json');

module.exports.registerUser = (req, res) => {
    console.log('>>>registerUser');
    const timestamp = new Date().getTime();
    console.log("request==>" + req);
    console.log('request body==>' + req.body);
    const data = req.body;
    console.log('data==>' + data);
    console.log(data.emailId);

    // Aws congnito related logic
    const poolData = {
        UserPoolId: config.aws.UserPoolId, // Your user pool id here    
        ClientId: config.aws.ClientId // Your client id here
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
            res.status(400).json({
                success: false,
                message: err
            });
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        console.log("congnito signup end");

        const params = {
            TableName: 'user',
            Item: {
                emailId: data.emailId,
                firstName: data.firstName,
                lastName: data.lastName,
                userName: data.userName,
                role: data.role,
                mobileNumber: data.mobilenumber,
                accountId: data.accountId,
                password: data.password,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        }

        console.log('adding user to dynamodb');
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
    });
}

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
                res.status(200).json({
                    success: false,
                    message: "No record found"
                });
            }

        }
    });
}
module.exports.verifyUser = (req, res) => {
    console.log('>>>verifyUser');
    console.log('request body==>' + req.body);
    const data = req.body;
    console.log('data==>' + data);
    // Aws congnito related logic
    const poolData = {
        UserPoolId: config.aws.UserPoolId, // Your user pool id here    
        ClientId: config.aws.ClientId // Your client id here
    };
    const pool_region = config.aws.region;
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: data.emailId,
        Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    cognitoUser.confirmRegistration(data.pin, true, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).json({
                success: false,
                message: err
            });
        }
        if (result == "SUCCESS") {
            console.log("Successfully verified account!")
            cognitoUser.signOut()
            res.status(200).json({
                success: true,
                message: "Successfully verified account!"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Could not verify account!"
            });
        }
    })
}