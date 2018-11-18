const uuid = require('uuid');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
global.fetch = require('node-fetch');
const validator = require('validator');
const _ = require('lodash');

const dynamoDb = require('../db/dynamodb');
const USERS_TABLE = process.env.USERS_TABLE;
const config = require('../config/aws.json');

const EmailIdNotFound = require('../error/EmailIdNotFound');
const AccountNotFound = require('../error/AccountNotFound');
const UsernameNotFound = require('../error/UsernameNotFound');
const PasswordNotFound = require('../error/PasswordNotFound');
const FirstNameNotFound = require('../error/FirstNameNotFound');
const RoleNotFound = require('../error/RoleNotFound');
const UserNotFound = require('../error/UserNotFound');
const VerifyUserError = require('../error/VerifyUserError');
const VerificationCodeNotFound = require('../error/VerificationCodeNotFound');

module.exports.registerUser = (req, res) => {
    console.log('>>> Entering registerUser Function >> ', req);
    const timestamp = new Date().getTime();
    const data = req.body;

    if (_.isEmpty(data.emailId)) {

        console.error('emailId cannot be empty');
        throw new EmailIdNotFound(req.t('EmailIdNotFound'));

    } else if (!validator.isEmail(data.emailId)) {
        console.error('emailId is not correct');
        throw new EmailIdNotFound(req.t('WrongFormattedEmailId'));

    } else if (_.isEmpty(data.accountId)) {

        console.error('accountId cannot be empty.');
        throw new AccountNotFound(req.t('AccountIdNotFound'));

    } else if (_.isEmpty(data.userName)) {

        console.error('userName cannot be empty.');
        throw new UsernameNotFound(req.t('UsernameNotFound'));

    } else if (!validator.isEmail(data.userName)) {
        console.error('userName emailId is not correct');
        throw new UsernameNotFound(req.t('UsernameMustEMail'));

    } else if (_.isEmpty(data.password)) {

        console.error('password cannot be empty.');
        throw new PasswordNotFound(req.t('PasswordNotFound'));

    } else if (_.isEmpty(data.firstName)) {

        console.error('firstName cannot be empty.');
        throw new FirstNameNotFound(req.t('FirstNameNotFound'));

    } else if (_.isEmpty(data.role)) {

        console.error('role cannot be empty.');
        throw new RoleNotFound(req.t('RoleNotFound'));

    } else {

        const params = {
            TableName: USERS_TABLE,
            KeyConditionExpression: "#uname = :username",
            ExpressionAttributeNames: {
                "#uname": "userName"
            },
            ExpressionAttributeValues: {
                ":username": data.userName
            }
        };

        dynamoDb.query(params, (error, result) => {
            if (error) {
                //to be changed
                console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
                res.status(400).json({
                    errorcode: 'AccountCreationError',
                    errormessage: req.t('AccountCreationError')
                });
            } else {
                console.log("Query succeeded.");
                console.log("Query succeeded." + JSON.stringify(result));
                if (result.Items.length > 0) {
                    res.status(400).json({
                        errorcode: 'UserNameAlreadyExists',
                        errormessage: req.t('UserNameAlreadyExists')
                    });
                } else {
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

                    userPool.signUp(data.emailId, data.password, attributeList, null, (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(400).json({
                                errorcode: 'UserNameAlreadyExists',
                                errormessage: req.t('UserNameAlreadyExists')
                            });
                        }
                        cognitoUser = result.user;
                        console.log('user name is ', cognitoUser);
                        console.log("congnito signup end");

                        const params = {
                            TableName: USERS_TABLE,
                            Item: {
                                emailId: data.emailId,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                accountId: data.accountId,
                                userName: data.userName,
                                role: data.role,
                                mobileNumber: data.mobilenumber,
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
                                res.status(400).json({
                                    errorcode: 'UserNameAlreadyExists',
                                    errormessage: req.t('UserNameAlreadyExists')
                                });
                            }
                            res.status(200).json({
                                success: true,
                                user: user
                            });
                        });
                    });
                }
            }
        });
    }
};

module.exports.getUser = (req, res) => {
    console.log('>>>getUser', req);
    const userName = req.params.username;
    console.log('userName==>' + userName);

    var params = {
        TableName: USERS_TABLE,
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
            throw new UserNotFound(req.t('AccountCreationError'));
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
                res.status(400).json({
                    errorcode: 'UserNotFound',
                    errormessage: req.t('UserNotFound')
                });
            }
        }
    });
};
module.exports.verifyUser = (req, res) => {
    console.log('>>>verifyUser');
    console.log('request body==>', req.body);
    const data = req.body;
    console.log('data==>', data);
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
            throw new VerifyUserError(req.t('VerifyUserError'));
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
            throw new VerifyUserError(req.t('VerifyUserError'));
        }
    });
};


module.exports.getUserByAccount = (req, res) => {
    console.log('>>>getUserByAccount ', req);
    const accountId = req.params.id;
    if (_.isEmpty(accountId)) {
        console.error('accountId cannot be empty.');
        throw new AccountNotFound(req.t('AccountIdNotFound'));
    } else {
        console.log(`request verified now retriving account for Id: ${id}`);
        var params = {
            TableName: USERS_TABLE,
            "FilterExpression": "accountId = :accountId",
            ExpressionAttributeValues: {
                ":accountId": accountId
            }
        };

        dynamoDb.scan(params, (error, result) => {
            if (error) {
                console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
                console.log("No User found");
                res.status(404).json({
                    errorcode: 'UserNotFound',
                    errormessage: req.t('UserNotFound')
                });
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
                    res.status(400).json({
                        errorcode: 'UserNotFound',
                        errormessage: req.t('UserNotFound')
                    });
                }
            }
        });
    }
};


module.exports.isUserConfirm = (req, res) => {
    console.log('>>>isUserConfirm');
    const body = _.pick(req.body, ['userName', 'password']);
    console.log('>>> request body', body);
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
        console.log('>>> request body verified');
        // Aws congnito related logic
        const poolData = {
            UserPoolId: config.aws.UserPoolId,
            ClientId: config.aws.ClientId
        };
        console.log('>>> poolData', poolData);
        const pool_region = config.aws.region;
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        console.log('authenticationDetails');
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: body.userName,
            Password: body.password,
        });
        const userData = {
            Username: body.userName,
            Pool: userPool
        };
        console.log('>>> userData', userData);
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        console.log('authenticateUser');
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                res.status(200).json({
                    success: true,
                    message: "user is confirmed"
                });
            },
            onFailure: function (errCognito) {
                console.log('errCognito ||>>', errCognito);
                const errorcode = errCognito.code;
                if (errorcode === 'UserNotConfirmedException') {
                    res.status(401).json({
                        errorcode: 'UserNotConfirmedException',
                        errormessage: req.t('UserNotConfirmedException')
                    });
                } else {
                    res.status(401).json({
                        errorcode: 'WrongCredentials',
                        errormessage: req.t('WrongCredentials')
                    });
                }
            },
        });
    }
};

module.exports.resetPasswordVerificationCode = (req, res) => {
    console.log('|| >> Entering forgotPassword ');
    const body = _.pick(req.body, ['userName']);

    if (_.isEmpty(body.userName)) {
        console.error('userName cannot be empty.');
        throw new UsernameNotFound(req.t('UsernameNotFound'));

    } else if (!validator.isEmail(body.userName)) {
        console.error('userName cannot be empty.');
        throw new EmailIdNotFound(req.t('WrongFormattedEmailId'));

    } else {
        // Aws congnito related logic
        const poolData = {
            UserPoolId: config.aws.UserPoolId,
            ClientId: config.aws.ClientId
        };
        console.log('>>> poolData', poolData);
        const pool_region = config.aws.region;
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        console.log('authenticationDetails');
        const userData = {
            Username: body.userName,
            Pool: userPool
        };
        console.log('>>> userData', userData);
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.forgotPassword({
            onSuccess: function (result) {
                console.log('call result: ', result);
                res.status(200).json({
                    success: true,
                    message: 'verification email successfully sent'
                });
            },
            onFailure: function (cognitoerr) {
                console.log('cognitoerr==>> ', cognitoerr);
                res.status(400).json({
                    errorcode: cognitoerr.code,
                    errormessage: cognitoerr.message
                });
            }
        });
    }
};

module.exports.resendConfirmation = (req, res) => {
    console.log('|| >> Entering resendConfirmation ');
    const body = _.pick(req.body, ['userName']);

    if (_.isEmpty(body.userName)) {
        console.error('userName cannot be empty.');
        throw new UsernameNotFound(req.t('UsernameNotFound'));

    } else if (!validator.isEmail(body.userName)) {
        console.error('userName cannot be empty.');
        throw new EmailIdNotFound(req.t('WrongFormattedEmailId'));

    } else {
        // Aws congnito related logic
        const poolData = {
            UserPoolId: config.aws.UserPoolId,
            ClientId: config.aws.ClientId
        };
        console.log('>>> poolData', poolData);
        const pool_region = config.aws.region;
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        console.log('userPool', userPool);
        const userData = {
            Username: body.userName,
            Pool: userPool
        };
        console.log('>>> userData', userData);
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.resendConfirmationCode((cognitoerr, result) => {
            if (cognitoerr) {
                console.log('cognitoerr==>> ', cognitoerr);
                return res.status(400).json({
                    errorcode: cognitoerr.code,
                    errormessage: cognitoerr.message
                });
            } else {
                console.log('call result: ', result);
                res.status(200).json({
                    success: true,
                    message: 'verification email successfully sent'
                });
            }
        });
    }
};



module.exports.resetPassword = (req, res) => {
    console.log('|| >> Entering resetPassword ');
    const body = _.pick(req.body, ['userName', 'verificationCode', 'password']);

    if (_.isEmpty(body.userName)) {
        console.error('userName cannot be empty.');
        throw new UsernameNotFound(req.t('UsernameNotFound'));

    } else if (!validator.isEmail(body.userName)) {
        console.error('userName cannot be empty.');
        throw new EmailIdNotFound(req.t('WrongFormattedEmailId'));

    } else if (_.isEmpty(body.verificationCode)) {
        console.error('verificationCode cannot be empty.');
        throw new VerificationCodeNotFound(req.t('verificationCodeNotFound'));

    } else if (_.isEmpty(body.password)) {
        console.error('password cannot be empty.');
        throw new PasswordNotFound(req.t('PasswordNotFound'));

    } else {
        // Aws congnito related logic
        const poolData = {
            UserPoolId: config.aws.UserPoolId,
            ClientId: config.aws.ClientId
        };
        console.log('>>> poolData', poolData);
        const pool_region = config.aws.region;
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        console.log('userPool', userPool);
        const userData = {
            Username: body.userName,
            Pool: userPool
        };
        console.log('>>> userData', userData);
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        console.log('**************confirmPassword**********************');
        cognitoUser.confirmPassword(body.verificationCode, body.password, {
            onSuccess: function (result) {
                console.log('result => ', result);
                console.log('**********updating password to dynamodb**********');
                const params = {
                    TableName: USERS_TABLE,
                    Key: {
                        userName: body.userName
                    },
                    UpdateExpression: "set password = :password",
                    ExpressionAttributeValues: {
                        ":password": body.password
                    }
                };
                console.log('updating data to dynamodb');
                dynamoDb.update(params, (error, dbresult) => {
                    if (error) {
                        console.error(error);
                        res.status(400).json({
                            errorcode: 'UserNotFound',
                            errormessage: req.t('UserNotFound')
                        });
                    }
                    if (dbresult) {
                        console.log('result', JSON.stringify(dbresult));
                    }
                    res.status(200).json({
                        success: true,
                        message: "password succesfully changed"
                    });
                });
            },
            onFailure: function (errCognito) {
                console.log('errCognito=>', errCognito);
                return res.status(401).json({
                    errorcode: 'WrongCredentials',
                    errormessage: req.t('WrongCredentials')
                });
            }
        });
    }
};