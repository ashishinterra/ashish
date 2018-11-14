const express = require('express');
const panelRoute = express.Router({ mergeParams: true });

const panelController = require('../controllers/panelController');

panelRoute.route('/')
    .post(panelController.addPanel);

    module.exports = panelRoute;