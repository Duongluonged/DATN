const { pool, poolConnect, sql } = require('../config/db');

// ─── 1. Lấy danh sách thông báo của ứng viên ─────────────────────
const getNotifications = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const { type } = req.query; // 'job' | 'invite' | 'system' | undefined = all

        const request = pool.request().input('userId', sql.Int, parseInt(userId));
        let query = `
            SELECT 
                NotificationID, UserId, Type, Title, Content,
                IsRead, CreatedAt, RelatedID
            FROM Notifications
            WHERE UserId = @userId
        `;
        if (type && type !== 'all') {
            query += ` AND Type = @type`;
            request.input('type', sql.NVarChar, type);
        }
        query += ` ORDER BY CreatedAt DESC`;

        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getNotifications:', err);
        res.status(500).json({ message: 'Lỗi lấy thông báo', error: err.message });
    }
};

// ─── 2. Đếm thông báo chưa đọc ────────────────────────────────────
const getUnreadCount = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const result = await pool.request()
            .input('userId', sql.Int, parseInt(userId))
            .query(`SELECT COUNT(*) AS unread FROM Notifications WHERE UserId = @userId AND IsRead = 0`);
        res.status(200).json({ unread: result.recordset[0].unread });
    } catch (err) {
        console.error('❌ Lỗi getUnreadCount:', err);
        res.status(500).json({ message: 'Lỗi đếm thông báo', error: err.message });
    }
};

// ─── 3. Đánh dấu một thông báo đã đọc ─────────────────────────────
const markAsRead = async (req, res) => {
    try {
        await poolConnect;
        const { notificationId } = req.params;
        await pool.request()
            .input('id', sql.Int, parseInt(notificationId))
            .query(`UPDATE Notifications SET IsRead = 1 WHERE NotificationID = @id`);
        res.status(200).json({ message: 'Đã đánh dấu đã đọc' });
    } catch (err) {
        console.error('❌ Lỗi markAsRead:', err);
        res.status(500).json({ message: 'Lỗi cập nhật thông báo', error: err.message });
    }
};

// ─── 4. Đánh dấu TẤT CẢ đã đọc ───────────────────────────────────
const markAllAsRead = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        await pool.request()
            .input('userId', sql.Int, parseInt(userId))
            .query(`UPDATE Notifications SET IsRead = 1 WHERE UserId = @userId`);
        res.status(200).json({ message: 'Đã đánh dấu tất cả đã đọc' });
    } catch (err) {
        console.error('❌ Lỗi markAllAsRead:', err);
        res.status(500).json({ message: 'Lỗi cập nhật thông báo', error: err.message });
    }
};

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead };
