const express = require('express');
const router = express.Router();
const cognitoIdTokenController = require('../controllers/CognitoIdentityController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, cognitoIdTokenController.getIdToken);

module.exports = router;
