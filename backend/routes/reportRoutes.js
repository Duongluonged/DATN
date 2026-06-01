const express = require('express');
const router = express.Router();
const { createReport, getAllReports, updateReportStatus } = require('../controllers/reportController');

// Gửi báo cáo vi phạm
router.post('/', createReport);

// Lấy danh sách báo cáo (Admin)
router.get('/', getAllReports);

// Cập nhật trạng thái báo cáo (Admin xử lý)
router.put('/:reportId', updateReportStatus);

module.exports = router;
