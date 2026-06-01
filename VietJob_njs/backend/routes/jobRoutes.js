const express = require('express');
const router = express.Router();
const {
    searchJobs,
    getJobDetail,
    getJobsByEmployer,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/Jobcontroller');

// ─── QUAN TRỌNG: Specific routes phải đứng TRƯỚC generic /:id ──
// Tìm kiếm việc làm: GET /api/jobs/search?keyword=...
router.get('/search', searchJobs);

// Lấy danh sách tin của NTD: GET /api/jobs/employer/:userId
router.get('/employer/:userId', getJobsByEmployer);

// Đăng tin mới: POST /api/jobs/employer/:userId
router.post('/employer/:userId', createJob);

// Cập nhật tin: PUT /api/jobs/:jobId
router.put('/:jobId', updateJob);

// Ẩn/xóa tin: DELETE /api/jobs/:jobId
router.delete('/:jobId', deleteJob);

// Chi tiết việc làm (public): GET /api/jobs/:id  ← phải đứng CUỐI
router.get('/:id', getJobDetail);

module.exports = router;