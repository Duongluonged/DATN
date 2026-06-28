const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/conversations/:userId', messageController.getConversations);

router.get('/history/:userId/:partnerId', messageController.getChatHistory);

router.put('/read/:userId/:partnerId', messageController.markAsRead);

router.post('/send', messageController.sendMessage);

router.get('/employer-of-company/:companyId', messageController.getEmployerOfCompany);

module.exports = router;
