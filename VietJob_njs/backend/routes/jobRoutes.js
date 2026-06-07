const express = require('express');
const router = express.Router();
const {
    searchJobs,
    getJobDetail,
    getJobsByEmployer,
    createJob,
    updateJob,
    deleteJob,
    getAllJobsAdmin,
    toggleJobStatus,
    getEmployerStats
} = require('../controllers/Jobcontroller');

// ─── QUAN TRỌNG: Specific routes phải đứng TRƯỚC generic /:id ──
// Tìm kiếm việc làm: GET /api/jobs/search?keyword=...
router.get('/search', searchJobs);

// Quản lý tin đăng cho Admin: GET /api/jobs/admin/all
router.get('/admin/all', getAllJobsAdmin);

// Admin cập nhật duyệt/từ chối tin: PUT /api/jobs/admin/status/:jobId
router.put('/admin/status/:jobId', toggleJobStatus);

// Lấy danh sách tin của NTD: GET /api/jobs/employer/:userId
router.get('/employer/:userId', getJobsByEmployer);

// Lấy thống kê phân tích của NTD: GET /api/jobs/employer/:userId/stats
router.get('/employer/:userId/stats', getEmployerStats);

// Đăng tin mới: POST /api/jobs/employer/:userId
router.post('/employer/:userId', createJob);

// Cập nhật tin: PUT /api/jobs/:jobId
router.put('/:jobId', updateJob);

// Ẩn/xóa tin: DELETE /api/jobs/:jobId
router.delete('/:jobId', deleteJob);

// Chi tiết việc làm (public): GET /api/jobs/:id  ← phải đứng CUỐI
router.get('/:id', getJobDetail);

module.exports = router;