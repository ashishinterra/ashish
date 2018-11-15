const _ = require('lodash');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
global.fetch = require('node-fetch');
const bcrypt = require("bcryptjs");
const validator = require('validator');

const dynamoDb = require('../db/dynamodb');
const config = require('../config/aws.json');
//Error Imports
const UsernameNotFound = require('../error/UsernameNotFound');
const PasswordNotFound = require('../error/PasswordNotFound');
const WrongCredentials = require('../error/WrongCredentials');
const EmailIdNotFound = require('../error/EmailIdNotFound');


module.exports.login = (req, res) => {
    console.log(">> Entering Login Function");
    const body = _.pick(req.body, ['userName', 'password']);

    if (_.isEmpty(body.userName)) {
        console.error('userName cannot be empty.');
        throw new UsernameNotFound(req.t('UsernameNotFound'));

    } else if (!validator.isEmail(body.userName)) {
        console.error('userName cannot be empty.');
        throw new EmailIdNotFound(req.t('WrongFormattedEmailId'));

    } else if (_.isEmpty(body.password)) {
        console.error('password cannot be empty.');
        throw new PasswordNotFound(req.t('PasswordNotFound'));

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
        };

        dynamoDb.query(params, (error, result) => {
            if (error) {
                console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
                console.error('wrong username or password');
                throw new WrongCredentials(req.t('WrongCredentials'));
            } else {
                console.log("Query succeeded.");
                console.log("Query succeeded." + JSON.stringify(result));
                if (result.Items.length > 0) {
                    console.log("Query succeeded || >>> " + result.Items.length);
                }
                result.Items.forEach(function (item) {
                    console.log(" Item :: ", JSON.stringify(item));
                    const user = item;
                    console.log(" user :: ", user);
                    if (body.password === item.password) {
                            // Aws congnito related logic
                            const poolData = {
                                UserPoolId: config.aws.UserPoolId,
                                ClientId: config.aws.ClientId
                            };
                            const pool_region = config.aws.region;
                            const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                            const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                                Username: item.emailId,
                                Password: body.password,
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
                                onFailure: function (errCognito) {
                                    console.log(errCognito);
                                    res.status(401).json({
                                        errorcode: 'WrongCredentials',
                                        errormessage: req.t('WrongCredentials')
                                    });
                                },
                            });
                        } else {
                            console.log(`password does not match`);
                            res.status(401).json({
                                errorcode: 'WrongCredentials',
                                errormessage: req.t('WrongCredentials')
                            });
                        }
                });
            }
        });
    }
};