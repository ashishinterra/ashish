'use strict';

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const accountController = require('./controllers/accountController');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');

const app = express();


app.get('/', (req, res) => {
  log.info("requested resource is not unavailable");
  res.status(404).send();
});

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

// ToDo 
// API token management
// Account functions
app.post('/v1/account', accountController.registerAccount);
app.get('/v1/account', accountController.getAccount);
app.put('/v1/account/:id', accountController.updateAccount);

// User Functions
app.post('/v1/user', userController.registerUser);
app.get('/v1/user/:username', userController.getUser);

app.post('/v1/login', authController.login);

module.exports = app;