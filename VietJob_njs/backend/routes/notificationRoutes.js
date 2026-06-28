const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require('../controllers/notificationController');

router.get('/:userId', getNotifications);

router.get('/:userId/unread-count', getUnreadCount);

router.patch('/:notificationId/read', markAsRead);

router.patch('/all/:userId/read', markAllAsRead);

module.exports = router;
