const _ = require('lodash');
const jwt = require('jsonwebtoken');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
global.fetch = require('node-fetch');

const dynamoDb = require('../db/dynamodb');
const config = require('../config/aws.json');


module.exports.login = (req, res) => {
    console.log(req.body);
    var body = _.pick(req.body, ['userName', 'password']);
    console.log(body);
    if (_.isEmpty(body.userName)) {
        res.status(400).send({
            success: false,
            message: 'userName cannot be empty.'
        });
    } else if (_.isEmpty(body.password)) {
        res.status(400).send({
            success: false,
            message: 'password cannot be empty.'
        });
    } else {
        var params = {
            TableName: 'user',
            KeyConditionExpression: "#uname = :username",
            ExpressionAttributeNames: {
                "#uname": "userName"
            },
            ExpressionAttributeValues: {
                ":username": body.userName
            }
        }

        dynamoDb.query(params, (error, result) => {
            if (error) {
                console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
                res.status(401).send('wrong username or password');
            } else {
                console.log("Query succeeded.");
                console.log("Query succeeded." + JSON.stringify(result));
                result.Items.forEach(function (item) {
                    console.log(" Item :: ", JSON.stringify(item));
                    const user = item;
                    console.log(" user :: ", user);
                    if (body.password === item.password) {
                        // Aws congnito related logic
                        const poolData = {
                            UserPoolId: config.aws.UserPoolId, // Your user pool id here    
                            ClientId: config.aws.ClientId // Your client id here
                        };
                        const pool_region = config.aws.region;
                        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                            Username: item.emailId,
                            Password: item.password,
                        });
                        var userData = {
                            Username: item.emailId,
                            Pool: userPool
                        };
                        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                        cognitoUser.authenticateUser(authenticationDetails, {
                            onSuccess: function (result) {
                                console.log('access token + ' + result.getAccessToken().getJwtToken());
                                console.log('id token + ' + result.getIdToken().getJwtToken());
                                console.log('refresh token + ' + result.getRefreshToken().getToken());

                                res.status(200).json({
                                    success: true,
                                    user: user,
                                    token: result.getAccessToken().getJwtToken()
                                });
                            },
                            onFailure: function (err) {
                                console.log(err);
                            },
                        });
                    } else {
                        res.status(401).json({
                            success: false,
                            message: 'wrong username or password'
                        });
                    }
                });
            }
        });
    }
};