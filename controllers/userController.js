const uuid = require('uuid');
const dynamoDb = require('../db/dynamodb');

module.exports.registerUser = (req, res) => {
    console.log('>>>registerUser');
    const timestamp = new Date().getTime();
    console.log("request==>" + req);
    console.log('request body==>' + req.body);
    const data = req.body;
    console.log('data==>' + data);
    console.log(data.emailId);

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