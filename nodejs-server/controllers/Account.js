'use strict';

var utils = require('../utils/writer.js');
var Account = require('../service/AccountService');

module.exports.accountIdGET = function accountIdGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Account.accountIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.accountIdPUT = function accountIdPUT (req, res, next) {
  var id = req.swagger.params['id'].value;
  var accountObject = req.swagger.params['accountObject'].value;
  Account.accountIdPUT(id,accountObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.accountPOST = function accountPOST (req, res, next) {
  var accountObject = req.swagger.params['accountObject'].value;
  Account.accountPOST(accountObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
