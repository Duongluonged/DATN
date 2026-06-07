const jwt = require('jsonwebtoken');
const { pool, poolConnect, sql } = require('../config/db');

const auth = (req, res, next) => {
    // Lấy token từ header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Không tìm thấy Token. Vui lòng đăng nhập." });
    }

    try {
        // Thay 'YOUR_SECRET_KEY' bằng key thực tế của bạn
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        req.user = decoded; // Lưu thông tin user vào request
        next(); // Chuyển sang middleware/controller tiếp theo
    } catch (error) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
};


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || "BiMatVietJob2026");
        next();
    } catch {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

const isAdmin = async (req, res, next) => {
    await poolConnect;
    // Kiểm tra role từ DB thay vì chỉ dựa vào token
    const result = await pool.request()
        .input('userId', sql.Int, req.user.id)
        .query(`
      SELECT r.RoleName FROM Roles r
      INNER JOIN UserRoles ur ON r.RoleId = ur.RoleId
      WHERE ur.UserId = @userId AND r.RoleName = 'Admin'
    `);

    if (result.recordset.length === 0)
        return res.status(403).json({ message: 'Không có quyền admin' });

    next();
};

// Đảm bảo vừa callable vừa có thuộc tính
auth.verifyToken = verifyToken;
auth.isAdmin = isAdmin;

module.exports = auth;