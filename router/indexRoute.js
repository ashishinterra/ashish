const express = require('express');
const indexRoute = express.Router({mergeParams: true});

const userRoute = require('./userRoute');
const accountRoute = require('./accountRoute');
const panelRoute = require('./panelRoute');
const authRoute = require('./authRoute');
const verifyRoute = require('./verifyRoute');

// middleware that is specific to this router
indexRoute.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


indexRoute.use('/user', userRoute);
indexRoute.use('/account', accountRoute);
indexRoute.use('/panel', panelRoute);
indexRoute.use('/login', authRoute);
indexRoute.use('/verify', verifyRoute);

module.exports = indexRoute;