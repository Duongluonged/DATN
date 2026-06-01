const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, pool, poolConnect } = require("../config/db"); // Dùng cấu hình db của bạn
const JWT_SECRET = "BiMatVietJob2026"; // Nên để trong file .env
const crypto = require('crypto');
const transporter = require('../config/mailer');
const { v4: uuidv4 } = require('uuid');

exports.registerEmployer = async (req, res) => {
    await poolConnect;
    const {
        username, email, password,
        name, website, address, description
    } = req.body;

    // Validate cơ bản
    if (!username || !email || !password || !name) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();

        // 1. Kiểm tra email hoặc username đã tồn tại chưa
        const check = await new sql.Request(transaction)
            .input('email', sql.NVarChar, email)
            .input('username', sql.NVarChar, username)
            .query(`SELECT Id FROM Users WHERE Email = @email OR Username = @username`);

        if (check.recordset.length > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Email hoặc tên đăng nhập đã tồn tại' });
        }

        // 2. Tạo hồ sơ công ty trong bảng Companies
        const companyResult = await new sql.Request(transaction)
            .input('companyName', sql.NVarChar, name)
            .input('websiteURL', sql.NVarChar, website || null)
            .input('location', sql.NVarChar, address || null)
            .input('description', sql.NVarChar, description || null)
            .query(`
                INSERT INTO Companies (CompanyName, WebsiteURL, Location, Description, CreatedAt)
                OUTPUT INSERTED.CompanyID
                VALUES (@companyName, @websiteURL, @location, @description, GETDATE())
            `);

        const companyId = companyResult.recordset[0].CompanyID;

        // 3. Tạo tài khoản User với Status = 'pending' và liên kết CompanyID
        const hashed = await bcrypt.hash(password, 10);
        const userResult = await new sql.Request(transaction)
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, hashed)
            .input('email', sql.NVarChar, email)
            .input('status', sql.NVarChar, 'pending')
            .input('companyId', sql.Int, companyId)
            .query(`
                INSERT INTO Users (Username, Password, Email, Status, CompanyID, CreatedAt)
                OUTPUT INSERTED.Id
                VALUES (@username, @password, @email, @status, @companyId, GETDATE())
            `);

        const userId = userResult.recordset[0].Id;

        // 4. Gán Role 'Employer'
        const roleResult = await new sql.Request(transaction)
            .input('roleName', sql.NVarChar, 'Employer')
            .query(`SELECT RoleId FROM Roles WHERE RoleName = @roleName`);

        if (roleResult.recordset.length === 0) {
            await transaction.rollback();
            return res.status(500).json({ message: 'Không tìm thấy role Employer trong hệ thống' });
        }

        const roleId = roleResult.recordset[0].RoleId;
        await new sql.Request(transaction)
            .input('userId', sql.Int, userId)
            .input('roleId', sql.Int, roleId)
            .query(`INSERT INTO UserRoles (UserId, RoleId) VALUES (@userId, @roleId)`);

        await transaction.commit();

        res.status(201).json({
            message: 'Đăng ký thành công! Vui lòng chờ admin xét duyệt.'
        });

    } catch (err) {
        await transaction.rollback();
        console.error('Lỗi registerEmployer:', err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};
// Xử lý Đăng ký ứng viên
exports.register = async (req, res) => {
    try {
        await poolConnect;
        const { username, password, email, phone } = req.body;

        if (!username || !password || !email || !phone) {
            return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin bao gồm số điện thoại." });
        }

        // 1. Kiểm tra email/username đã tồn tại chưa
        const check = await pool.request()
            .input("email", sql.NVarChar, email)
            .input("username", sql.NVarChar, username)
            .query(`SELECT Id FROM Users WHERE Email = @email OR Username = @username`);

        if (check.recordset.length > 0) {
            return res.status(400).json({ error: "Email hoặc tên đăng nhập đã tồn tại." });
        }

        // 2. Hash mật khẩu và tạo tài khoản, lấy lại Id vừa tạo
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await pool.request()
            .input("Username", sql.NVarChar, username)
            .input("Password", sql.NVarChar, hashedPassword)
            .input("Email", sql.NVarChar, email)
            .input("Phone", sql.NVarChar, phone)
            .query(`
                INSERT INTO Users (Username, Password, Email, Phone)
                OUTPUT INSERTED.Id
                VALUES (@Username, @Password, @Email, @Phone)
            `);

        const newUserId = userResult.recordset[0].Id;

        // 3. Tìm RoleId của role "Candidate"
        const roleResult = await pool.request()
            .input("roleName", sql.NVarChar, "Candidate")
            .query(`SELECT RoleId FROM Roles WHERE RoleName = @roleName`);

        if (roleResult.recordset.length > 0) {
            const roleId = roleResult.recordset[0].RoleId;

            // 4. Gán role Candidate vào UserRoles
            await pool.request()
                .input("userId", sql.Int, newUserId)
                .input("roleId", sql.Int, roleId)
                .query(`INSERT INTO UserRoles (UserId, RoleId) VALUES (@userId, @roleId)`);
        }

        res.json({ message: "Đăng ký thành công" });
    } catch (err) {
        console.error("Lỗi đăng ký ứng viên:", err);
        res.status(500).json({ error: err.message });
    }
};

// Xử lý Đăng nhập - Đã cập nhật thêm Phân Quyền
exports.login = async (req, res) => {
    try {
        await poolConnect;
        const { email, password } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào cơ bản
        if (!email || !password) {
            return res.status(400).json({ error: "Vui lòng nhập Email và Mật khẩu" });
        }

        const request = new sql.Request(pool);
        // 2. Lấy User kèm theo toàn bộ danh sách Roles (Quyền) của họ
        const result = await request
            .input("Email", sql.NVarChar, email)
            .query(`
                SELECT u.Id, u.Username, u.Password, u.Status, r.RoleName
                FROM Users u
                LEFT JOIN UserRoles ur ON u.Id = ur.UserId
                LEFT JOIN Roles r ON ur.RoleId = r.RoleId
                WHERE u.Email = @Email
            `);

        const userRows = result.recordset;
        if (userRows.length === 0) return res.status(400).json({ error: "Email không tồn tại" });

        const firstRow = userRows[0];

        // 3. Kiểm tra mật khẩu (Bắt buộc với tất cả các bên)
        const isMatch = await bcrypt.compare(password, firstRow.Password);
        if (!isMatch) return res.status(400).json({ error: "Mật khẩu không đúng" });

        // 4. Gom tất cả các role của user này vào 1 mảng
        const roles = userRows.map(row => row.RoleName).filter(role => role !== null);

        // =========================================================================
        // 5. VÙNG LOGIC RIÊNG: CHỈ KIỂM TRA TRẠNG THÁI DUYỆT ĐỐI VỚI NHÀ TUYỂN DỤNG
        // =========================================================================
        if (roles.includes('Employer')) {
            // Chuyển status về chữ thường để tránh lỗi lệch kiểu chữ (Approved vs approved)
            const userStatus = firstRow.Status ? firstRow.Status.toLowerCase() : 'pending';

            if (userStatus === 'pending') {
                return res.status(403).json({
                    error: "Tài khoản Nhà tuyển dụng đang chờ Admin xét duyệt. Vui lòng kiểm tra lại email sau."
                });
            }
            if (userStatus === 'rejected') {
                return res.status(403).json({
                    error: "Hồ sơ Nhà tuyển dụng đã bị từ chối. Vui lòng liên hệ bộ phận hỗ trợ."
                });
            }
        }
        // ---> Nếu roles chứa 'Admin' hoặc 'Candidate' (Ứng viên), code sẽ bỏ qua đoạn check if ở trên 
        // và chạy thẳng xuống dưới này để đăng nhập bình thường.

        // 6. Tạo Token chứa Id và danh sách Roles
        const token = jwt.sign(
            {
                id: firstRow.Id,
                username: firstRow.Username,
                roles: roles
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 7. Trả dữ liệu về cho React lưu vào localStorage
        res.json({
            message: "Đăng nhập thành công",
            token,
            id: firstRow.Id,
            username: firstRow.Username,
            roles: roles
        });

    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        res.status(500).json({ error: "Lỗi hệ thống phía Server" });
    }
};

exports.approveRecruiter = async (req, res) => {
    const { userId, email } = req.body;

    try {
        await poolConnect;
        const request = new sql.Request(pool);

        // 1. Cập nhật Status sang Approved (Không đổi mật khẩu)
        await request
            .input("Id", sql.Int, userId)
            .input("Status", sql.NVarChar, 'Approved')
            .query(`
                UPDATE Users 
                SET Status = @Status
                WHERE Id = @Id
            `);

        // 2. Nội dung Email gửi đi
        const mailOptions = {
            from: '"VietJob Support" <support@vietjob.com>',
            to: email,
            subject: "[VietJob] Hồ sơ Nhà tuyển dụng đã được phê duyệt",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Chúc mừng!</h2>
                    <p>Hồ sơ công ty của bạn đã được hệ thống phê duyệt thành công.</p>
                    <p>Ngay bây giờ, bạn đã có thể <strong>đăng nhập vào hệ thống</strong> bằng Email và Mật khẩu bạn đã tạo lúc đăng ký.</p>
                    <br/>
                    <p>Trân trọng,<br/>Đội ngũ VietJob.</p>
                </div>
            `
        };

        // 3. Thực hiện gửi mail (Bỏ qua lỗi mail nếu cấu hình chưa chuẩn)
        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error("Không thể gửi email, nhưng tài khoản đã được duyệt:", mailErr);
        }

        res.json({ message: "Đã phê duyệt thành công." });

    } catch (err) {
        console.error("Lỗi khi duyệt NTD:", err);
        res.status(500).json({ error: "Lỗi hệ thống khi phê duyệt." });
    }
};

exports.rejectRecruiter = async (req, res) => {
    const { userId } = req.body;
    try {
        await poolConnect;
        const request = new sql.Request(pool);
        await request
            .input("Id", sql.Int, userId)
            .input("Status", sql.NVarChar, 'rejected')
            .query(`
                UPDATE Users 
                SET Status = @Status, UpdatedAt = GETDATE() 
                WHERE Id = @Id
            `);
        res.json({ message: "Đã từ chối nhà tuyển dụng." });
    } catch (err) {
        console.error("Lỗi từ chối NTD:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        await poolConnect;
        const request = new sql.Request(pool);
        const result = await request.query(`
            SELECT u.Id, u.Username, u.Email, u.Status, u.CreatedAt, r.RoleName
            FROM Users u
            LEFT JOIN UserRoles ur ON u.Id = ur.UserId
            LEFT JOIN Roles r ON ur.RoleId = r.RoleId
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy danh sách user:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// Lấy thông tin profile theo userId
exports.getProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        await poolConnect;
        const result = await pool.request()
            .input('Id', sql.Int, Number(userId))
            .query(`
                SELECT Id, Username, Email, Phone, Address
                FROM Users WHERE Id = @Id
            `);
        if (result.recordset.length === 0)
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Lỗi getProfile:', err);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

// Cập nhật phone, address
exports.updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { phone, address } = req.body;
    try {
        await poolConnect;
        await pool.request()
            .input('Id', sql.Int, Number(userId))
            .input('Phone', sql.NVarChar, phone || null)
            .input('Address', sql.NVarChar, address || null)
            .query(`UPDATE Users SET Phone = @Phone, Address = @Address WHERE Id = @Id`);
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        console.error('Lỗi updateProfile:', err);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};