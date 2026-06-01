const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Định nghĩa các đường dẫn và gán hàm xử lý từ Controller vào
router.post("/register", authController.register);
router.post("/login", authController.login);

const { registerEmployer, getAllUsers, approveRecruiter, rejectRecruiter, getProfile, updateProfile } = require('../controllers/authController');
router.post('/register/employer', registerEmployer);
router.get('/users', getAllUsers);
router.post('/approve', approveRecruiter);
router.post('/reject', rejectRecruiter);

// Profile ứng viên
router.get('/profile/:userId', getProfile);
router.put('/profile/:userId', updateProfile);

module.exports = router;