'use strict';


/**
 * Find account by accountId
 * Find account by accountId
 *
 * id  id of account to be return
 * returns GetAccount
 **/
exports.accountIdGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "zip" : "zip",
  "country" : "country",
  "createdAt" : "createdAt",
  "address" : "address",
  "city" : "city",
  "emailId" : "emailId",
  "id" : "id",
  "state" : "state",
  "deviceSerialNumber" : "deviceSerialNumber",
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
 * Update  HomexCloud account
 * Update Homex account
 *
 * id  update panel serial number
 * accountObject UpdateAccount 
 * returns GetAccount
 **/
exports.accountIdPUT = function(id,accountObject) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "zip" : "zip",
  "country" : "country",
  "createdAt" : "createdAt",
  "address" : "address",
  "city" : "city",
  "emailId" : "emailId",
  "id" : "id",
  "state" : "state",
  "deviceSerialNumber" : "deviceSerialNumber",
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
 * Create new HomexCloud account
 * create new Homex account
 *
 * accountObject CreateAccount 
 * returns GetAccount
 **/
exports.accountPOST = function(accountObject) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "zip" : "zip",
  "country" : "country",
  "createdAt" : "createdAt",
  "address" : "address",
  "city" : "city",
  "emailId" : "emailId",
  "id" : "id",
  "state" : "state",
  "deviceSerialNumber" : "deviceSerialNumber",
  "updatedAt" : "updatedAt"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

