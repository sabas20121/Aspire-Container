const express = require('express');
const router = express.Router();

const cognitoIdentityController = require('../controllers/CognitoIdentityController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, cognitoIdentityController.getIdentityId);

module.exports = router;
