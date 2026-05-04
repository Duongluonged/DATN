const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const auth = require('../middlewares/auth'); // Middleware check JWT

// Chỉ Employer mới được đăng tin
router.post('/create', auth, authorize('employer'), jobController.createJob);

// Chỉ Admin mới được xóa tin
router.delete('/:id', auth, authorize('admin'), jobController.deleteJob);

module.exports = router;