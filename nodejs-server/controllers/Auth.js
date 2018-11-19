'use strict';

var utils = require('../utils/writer.js');
var Auth = require('../service/AuthService');

module.exports.loginPOST = function loginPOST (req, res, next) {
  var loginObject = req.swagger.params['loginObject'].value;
  Auth.loginPOST(loginObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.verifyPOST = function verifyPOST (req, res, next) {
  var verifyObject = req.swagger.params['VerifyObject'].value;
  Auth.verifyPOST(verifyObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
