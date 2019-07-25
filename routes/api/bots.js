'use strict';

let express = require('express');
let router = express.Router();

let botsRouteHandlers = require('./bots/handlers');


router.post('/depositItems', botsRouteHandlers.depositItems);


module.exports = router;
