const express = require('express');
const router = express.Router();
const askMeController = require('../controllers/AskMeController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, askMeController.generateAskMeURL);

module.exports = router;
