const express = require('express');
const userRoute = express.Router({mergeParams: true});


const userController = require('../controllers/userController');


userRoute.route('/')
        .post(userController.registerUser);

userRoute.route('/:username')
         .get( userController.getUser);

module.exports = userRoute;