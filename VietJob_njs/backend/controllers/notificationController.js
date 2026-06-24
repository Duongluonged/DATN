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
                MaThongBao AS NotificationID, MaNguoiDung AS UserId, LoaiThongBao AS Type, TieuDe AS Title, NoiDung AS Content,
                DaDoc AS IsRead, NgayTao AS CreatedAt, MaLienQuan AS RelatedID
            FROM ThongBao
            WHERE MaNguoiDung = @userId
        `;
        if (type && type !== 'all') {
            query += ` AND LoaiThongBao = @type`;
            request.input('type', sql.NVarChar, type);
        }
        query += ` ORDER BY NgayTao DESC`;

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
            .query(`SELECT COUNT(*) AS unread FROM ThongBao WHERE MaNguoiDung = @userId AND DaDoc = 0`);
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
            .query(`UPDATE ThongBao SET DaDoc = 1 WHERE MaThongBao = @id`);
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
            .query(`UPDATE ThongBao SET DaDoc = 1 WHERE MaNguoiDung = @userId`);
        res.status(200).json({ message: 'Đã đánh dấu tất cả đã đọc' });
    } catch (err) {
        console.error('❌ Lỗi markAllAsRead:', err);
        res.status(500).json({ message: 'Lỗi cập nhật thông báo', error: err.message });
    }
};

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead };
