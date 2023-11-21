const express = require('express');
const router = express.Router();
const quickSightUserController = require('../controllers/QuickSightUserController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, quickSightUserController.getUserDetails);

module.exports = router;
