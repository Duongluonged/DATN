const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Định nghĩa các đường dẫn và gán hàm xử lý từ Controller vào
router.post("/register", authController.register);
router.post("/login", authController.login);

const { registerEmployer, getAllUsers, approveRecruiter, rejectRecruiter, getProfile, updateProfile, deleteUser } = require('../controllers/authController');
router.post('/register/employer', registerEmployer);
router.get('/users', getAllUsers);
router.post('/approve', approveRecruiter);
router.post('/reject', rejectRecruiter);
router.delete('/users/:userId', deleteUser);

// Profile ứng viên
router.get('/profile/:userId', getProfile);
router.put('/profile/:userId', updateProfile);

// Đổi mật khẩu
const { changePassword } = require('../controllers/authController');
router.put('/profile/:userId/password', changePassword);

module.exports = router;