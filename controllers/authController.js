const _ = require('lodash');
const jwt = require('jsonwebtoken');

const dynamoDb = require('../db/dynamodb');
const config = require('../config/secrets.json');


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
                        var token = jwt.sign({ id: item.userName }, config.secretkey, {
                            expiresIn: config.authTokenExperationTime
                        });
                        res.status(200).json({
                            success: true,
                            user: user,
                            token: token
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