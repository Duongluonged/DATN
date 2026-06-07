const express = require('express');
const router = express.Router();
const {
    postApplyJob,
    getApplicationsByEmployer,
    updateApplicationStatus,
    getApplicationsByCandidate
} = require('../controllers/applicationController');

// Ứng viên nộp đơn: POST /api/applications/apply
router.post('/apply', postApplyJob);

// Lấy danh sách ứng viên của NTD: GET /api/applications/employer/:userId
router.get('/employer/:userId', getApplicationsByEmployer);

// Lấy lịch sử ứng tuyển của ứng viên: GET /api/applications/candidate/:userId
router.get('/candidate/:userId', getApplicationsByCandidate);

// Cập nhật trạng thái: PATCH /api/applications/:applicationId/status
router.patch('/:applicationId/status', updateApplicationStatus);

module.exports = router;
