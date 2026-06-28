const express = require('express');
const router = express.Router();
const { createReport, getAllReports, updateReportStatus } = require('../controllers/reportController');

router.post('/', createReport);

router.get('/', getAllReports);

router.put('/:reportId', updateReportStatus);

module.exports = router;
