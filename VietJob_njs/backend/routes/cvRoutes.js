const express = require("express");
const router = express.Router();
const cv = require("../controllers/cvController");

// ── CV chính (Bio + Skills) ───────────────────────────────────────────────────
router.get("/:userId", cv.getCv);
router.post("/:userId/bio", cv.saveBio);
router.post("/:userId/skills", cv.saveSkills);

// ── Học vấn ──────────────────────────────────────────────────────────────────
router.get("/:userId/education", cv.getEducation);
router.post("/:userId/education", cv.addEducation);
router.put("/:userId/education/:id", cv.updateEducation);
router.delete("/:userId/education/:id", cv.deleteEducation);

// ── Kinh nghiệm ──────────────────────────────────────────────────────────────
router.get("/:userId/experience", cv.getExperience);
router.post("/:userId/experience", cv.addExperience);
router.put("/:userId/experience/:id", cv.updateExperience);
router.delete("/:userId/experience/:id", cv.deleteExperience);

module.exports = router;
