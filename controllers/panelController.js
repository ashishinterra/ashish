const uuid = require('uuid');
const _ = require('lodash');

const dynamoDb = require('../db/dynamodb');
//Custom Error imports
const EmailIdNotFound = require('../error/EmailIdNotFound');
const PanelAdditionError = require('../error/PanelAdditionError');


module.exports.addPanel = (req, res) => {

    console.log('>>>addPanel');
    const timestamp = new Date().getTime();
    console.log(req);
    const data = req.body;
    console.log(data);

    if (_.isEmpty(data.deviceSerialNumber)) {
        throw new EmailIdNotFound('emailId cannot be empty');
    } else if (!validator.isEmail(data.emailId)) {
        throw new EmailIdNotFound('emailId is not correct');
    }

    console.log('request body verified');
    const params = {
        TableName: 'panel',
        Item: {
            id: uuid.v1(),
            deviceSerialNumber: data.deviceSerialNumber,
            accountId: data.accountId,
            isMaster: data.isMaster,
            isActive: true,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    };
    const panelObject = {
        "id": params.Item.id,
        "deviceSerialNumber": params.Item.deviceSerialNumber,
        "accountId": params.accountId,
        "isMaster": data.isMaster,
        "isActive": true,
        "createdAt": params.Item.createdAt,
        "updatedAt": params.Item.updatedAt
    };
    console.log('panelObject >> ', panelObject);
    console.log('adding data to dynamodb');
    dynamoDb.put(params, (error, result) => {
        if (error) {
            throw new PanelAdditionError();
        }
        res.status(200).json({
            success: true,
            account: panelObject
        });
    });
};