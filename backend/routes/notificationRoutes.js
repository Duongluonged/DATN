const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require('../controllers/notificationController');

// Lấy danh sách thông báo: GET /api/notifications/:userId?type=job|invite|system
router.get('/:userId', getNotifications);

// Đếm chưa đọc: GET /api/notifications/:userId/unread-count
router.get('/:userId/unread-count', getUnreadCount);

// Đánh dấu 1 thông báo đã đọc: PATCH /api/notifications/:notificationId/read
router.patch('/:notificationId/read', markAsRead);

// Đánh dấu tất cả đã đọc: PATCH /api/notifications/all/:userId/read
router.patch('/all/:userId/read', markAllAsRead);

module.exports = router;
