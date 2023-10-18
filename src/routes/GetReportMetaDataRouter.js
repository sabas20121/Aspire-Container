const express = require('express');
const router = express.Router();
const reportMetaDataController = require('../controllers/ReportMetaDataController');
const authorize = require('../authorization/Authorization.js');

router.post('/', authorize, reportMetaDataController.getReportMetaData);

module.exports = router;
