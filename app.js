'use strict';

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');


const accountController = require('./controllers/accountController');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const panelController = require('./controllers/panelController');
const errHandlerMiddleware = require('./middleware/errorHandler');

const app = express();

  // Use cors
  app.use(cors());
  // parse application/json
  app.use(bodyParser.json());
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT');
    next();
  });

app.get('/', (req, res, next) => {
  console.error(`${req.ip} tried to reach ${req.originalUrl}`);
  let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});


// ToDo 
// API token management
// Account functions
app.post('/v1/account', accountController.registerAccount);
app.get('/v1/account/:id', accountController.getAccount);
app.put('/v1/account/:id', accountController.updateAccount);
app.get('/v1/account/:id/user', userController.getUserByAccount);

// User Functions
app.post('/v1/user', userController.registerUser);
app.get('/v1/user/:username', userController.getUser);

//Panel Functions
app.post('/v1/panel', panelController.addPanel);

app.post('/v1/login', authController.login);
app.post('/v1/verify', userController.verifyUser);

//this should be last statement before export app
app.use(errHandlerMiddleware.errorHandler);
module.exports = app;