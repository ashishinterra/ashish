'use strict';


/**
 * Login
 * create new Homex user
 *
 * loginObject LoginRequest 
 * returns LoginResponse
 **/
exports.loginPOST = function(loginObject) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "success" : "success",
  "token" : "token"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * verify user with confirmation code
 * verify user with confirmation code
 *
 * verifyObject VerifyUserRequest 
 * returns VerifyUserResponse
 **/
exports.verifyPOST = function(verifyObject) {
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

