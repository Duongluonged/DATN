const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Route lấy danh sách hội thoại của 1 user
router.get('/conversations/:userId', messageController.getConversations);

// Route lấy lịch sử nhắn tin giữa 2 user
router.get('/history/:userId/:partnerId', messageController.getChatHistory);

// Route đánh dấu tin nhắn là đã đọc
// (Khi mở cửa sổ chat với đối tác)
router.put('/read/:userId/:partnerId', messageController.markAsRead);

// Route gửi tin nhắn mới
router.post('/send', messageController.sendMessage);

// Route lấy nhà tuyển dụng của công ty
router.get('/employer-of-company/:companyId', messageController.getEmployerOfCompany);

module.exports = router;
