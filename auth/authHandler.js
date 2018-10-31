const jwt = require('jsonwebtoken');
const config = require('../config/secrets.json');

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}


module.exports.auth = (event, context, callback) => {
    console.log('req :: ' + JSON.stringify(event));
    const token = event.authorizationToken;
    console.log('token :: ' + token);
    if (!token)
        return callback(null, 'Unauthorized');
    jwt.verify(token, config.secretkey, (err, decoded) => {
        if (err)
            return callback(null, 'Unauthorized');

        // if everything is good, save to request for use in other routes
        return callback(null, generatePolicy(decoded.id, 'Allow', event.methodArn))
    });
}