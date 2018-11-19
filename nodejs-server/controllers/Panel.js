'use strict';

var utils = require('../utils/writer.js');
var Panel = require('../service/PanelService');

module.exports.addInventory = function addInventory (req, res, next) {
  var location = req.swagger.params['location'].value;
  Panel.addInventory(location)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
