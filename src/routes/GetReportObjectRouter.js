const express = require('express');
const router = express.Router();
const reportObjectController = require('../controllers/ReportObjectController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, reportObjectController.getReportObject);

module.exports = router;
