const express = require('express');
const router = express.Router();
const clientObjectController = require('../controllers/ClientObjectController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, clientObjectController.getClientObject);

module.exports = router;
