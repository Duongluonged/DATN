const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/reviewController");

// POST   /api/reviews                    → gửi đánh giá mới
router.post("/", ctrl.createReview);

// GET    /api/reviews/:companyId         → lấy danh sách đánh giá của công ty
router.get("/:companyId", ctrl.getReviews);

// GET    /api/reviews/:companyId/stats   → thống kê điểm trung bình
router.get("/:companyId/stats", ctrl.getReviewStats);

module.exports = router;
