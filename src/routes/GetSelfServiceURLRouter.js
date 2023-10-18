const express = require('express');
const router = express.Router();
const selfServiceController = require('../controllers/SelfServiceController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, selfServiceController.generateSelfServiceURL);

module.exports = router;
