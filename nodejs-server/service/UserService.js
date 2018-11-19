'use strict';


/**
 * verify user is confirmed or not
 * verify user is confirmed or not
 *
 * userObject LoginRequest 
 * returns VerifyUserResponse
 **/
exports.userIsconfirmedPOST = function(userObject) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "success" : "success",
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create new HomexCloud account user
 * create new Homex user
 *
 * userObject CreateUser 
 * returns GetUser
 **/
exports.userPOST = function(userObject) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "accountId" : "accountId",
  "firstName" : "firstName",
  "lastName" : "lastName",
  "createdAt" : "createdAt",
  "password" : "password",
  "role" : "owner",
  "userStatus" : "active",
  "mobileNumber" : "mobileNumber",
  "emailId" : "emailId",
  "id" : "id",
  "userName" : "userName",
  "updatedAt" : "updatedAt"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Resend user confirmation email. this will also verify email as wll as user in cognito
 * Resend user confirmation email. this will also verify email as wll as user in cognito
 *
 * userObject ResetpassVerifyRequest 
 * returns VerifyUserResponse
 **/
exports.userResendconfirmationPOST = function(userObject) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "success" : "success",
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * reset passsword
 * reset passsword
 *
 * userObject ResetpasswordRequest 
 * returns VerifyUserResponse
 **/
exports.userResetpasswordPOST = function(userObject) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "success" : "success",
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Send reset passsword verification code to registered  & verified emailId
 * Send reset passsword verification code to registered  & verified emailId
 *
 * userObject ResetpassVerifyRequest 
 * returns VerifyUserResponse
 **/
exports.userResetpasswordcodePOST = function(userObject) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "success" : "success",
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Find user by userName
 * Returns a single User
 *
 * username  username of user to return
 * returns GetUser
 **/
exports.userUsernameGET = function(username) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "accountId" : "accountId",
  "firstName" : "firstName",
  "lastName" : "lastName",
  "createdAt" : "createdAt",
  "password" : "password",
  "role" : "owner",
  "userStatus" : "active",
  "mobileNumber" : "mobileNumber",
  "emailId" : "emailId",
  "id" : "id",
  "userName" : "userName",
  "updatedAt" : "updatedAt"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

