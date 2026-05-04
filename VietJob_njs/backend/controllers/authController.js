const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, pool, poolConnect } = require("../config/db"); // Dùng cấu hình db của bạn

const JWT_SECRET = "BiMatVietJob2026"; // Nên để trong file .env

// Xử lý Đăng ký (Giữ nguyên của bạn)
exports.register = async (req, res) => {
    try {
        await poolConnect;
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const request = new sql.Request(pool);

        await request
            .input("Username", sql.NVarChar, username)
            .input("Password", sql.NVarChar, hashedPassword)
            .input("Email", sql.NVarChar, email)
            .query(`INSERT INTO Users (Username, Password, Email) VALUES (@Username, @Password, @Email)`);

        res.json({ message: "Đăng ký thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Xử lý Đăng nhập - Đã cập nhật thêm Phân Quyền
exports.login = async (req, res) => {
    try {
        await poolConnect;
        const { email, password } = req.body;
        const request = new sql.Request(pool);

        // 1. Truy vấn lấy User kèm theo danh sách Roles (Dùng JOIN)
        // Lưu ý: bảng Users của bạn có cột [Id] nên dùng u.Id
        const result = await request
            .input("Email", sql.NVarChar, email)
            .query(`
                SELECT u.Id, u.Username, u.Password, r.RoleName
                FROM Users u
                LEFT JOIN UserRoles ur ON u.Id = ur.UserId
                LEFT JOIN Roles r ON ur.RoleId = r.RoleId
                WHERE u.Email = @Email
            `);

        const userRows = result.recordset;
        if (userRows.length === 0) return res.status(400).json({ error: "Email không tồn tại" });

        const firstRow = userRows[0];

        // 2. Kiểm tra mật khẩu (Sử dụng bcrypt.compare vì dữ liệu trong DB là hash)
        const isMatch = await bcrypt.compare(password, firstRow.Password);
        if (!isMatch) return res.status(400).json({ error: "Mật khẩu không đúng" });

        // 3. Lấy tất cả các role của user này vào 1 mảng (Lọc các giá trị null nếu có)
        const roles = userRows.map(row => row.RoleName).filter(role => role !== null);

        // 4. Tạo Token chứa Id và danh sách Roles
        const token = jwt.sign(
            {
                id: firstRow.Id,
                username: firstRow.Username,
                roles: roles
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 5. Trả về kết quả cho Frontend
        res.json({
            message: "Đăng nhập thành công",
            token,
            username: firstRow.Username,
            roles: roles // Trả về để ReactJS lưu vào localStorage
        });

    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        res.status(500).json({ error: "Lỗi hệ thống phía Server" });
    }
};