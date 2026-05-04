const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Định nghĩa các đường dẫn và gán hàm xử lý từ Controller vào
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;