const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, dashboardController.generateDashboardURL);

module.exports = router;
