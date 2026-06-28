const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/reviewController");

router.post("/", ctrl.createReview);

router.get("/:companyId", ctrl.getReviews);

router.get("/:companyId/stats", ctrl.getReviewStats);

module.exports = router;
