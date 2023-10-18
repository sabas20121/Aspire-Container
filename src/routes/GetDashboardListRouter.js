const express = require('express');
const router = express.Router();
const dashboardListController = require('../controllers/DashboardListController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, dashboardListController.getDashboardList);

module.exports = router;
