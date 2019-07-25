'use strict';

let express = require('express');
let router = express.Router();

let userAuthRouteHandlers = require('./auth/handlers');

router.post('/login', userAuthRouteHandlers.login);

router.post('/register', userAuthRouteHandlers.register);

router.post('/resetPass', userAuthRouteHandlers.restPass);

module.exports = router;
