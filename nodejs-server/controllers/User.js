'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.userIsconfirmedPOST = function userIsconfirmedPOST (req, res, next) {
  var userObject = req.swagger.params['userObject'].value;
  User.userIsconfirmedPOST(userObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userPOST = function userPOST (req, res, next) {
  var userObject = req.swagger.params['userObject'].value;
  User.userPOST(userObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userResendconfirmationPOST = function userResendconfirmationPOST (req, res, next) {
  var userObject = req.swagger.params['userObject'].value;
  User.userResendconfirmationPOST(userObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userResetpasswordPOST = function userResetpasswordPOST (req, res, next) {
  var userObject = req.swagger.params['userObject'].value;
  User.userResetpasswordPOST(userObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userResetpasswordcodePOST = function userResetpasswordcodePOST (req, res, next) {
  var userObject = req.swagger.params['userObject'].value;
  User.userResetpasswordcodePOST(userObject)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userUsernameGET = function userUsernameGET (req, res, next) {
  var username = req.swagger.params['username'].value;
  User.userUsernameGET(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
