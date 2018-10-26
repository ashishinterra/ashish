'use strict';

const express = require('express');
const accountController = require('./controllers/accountController');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.get('/',(req,res)=>{
  log.info("resource requested is not unavailable");
  res.status(404).send();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// ToDo 
// API token management
app.post('/account', accountController.registerAccount);
module.exports = app;