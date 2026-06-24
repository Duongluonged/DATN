const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, pool, poolConnect } = require("../config/db"); // Dùng cấu hình db của bạn
const JWT_SECRET = "BiMatVietJob2026"; // Nên để trong file .env
const crypto = require('crypto');
const transporter = require('../config/mailer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

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
            .query(`SELECT Id FROM NguoiDung WHERE Email = @email OR TenDangNhap = @username`);

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
                INSERT INTO CongTy (TenCongTy, DuongDanWebsite, DiaDiem, MoTa, NgayTao, NoiBat)
                OUTPUT INSERTED.MaCongTy AS CompanyID
                VALUES (@companyName, @websiteURL, @location, @description, GETDATE(), 0)
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
                INSERT INTO NguoiDung (TenDangNhap, MatKhau, Email, TrangThai, MaCongTy, NgayTao)
                OUTPUT INSERTED.Id
                VALUES (@username, @password, @email, @status, @companyId, GETDATE())
            `);

        const userId = userResult.recordset[0].Id;

        // 4. Gán Role 'Employer'
        const roleResult = await new sql.Request(transaction)
            .input('roleName', sql.NVarChar, 'Employer')
            .query(`SELECT MaVaiTro AS RoleId FROM VaiTro WHERE TenVaiTro = @roleName`);

        if (roleResult.recordset.length === 0) {
            await transaction.rollback();
            return res.status(500).json({ message: 'Không tìm thấy role Employer trong hệ thống' });
        }

        const roleId = roleResult.recordset[0].RoleId;
        await new sql.Request(transaction)
            .input('userId', sql.Int, userId)
            .input('roleId', sql.Int, roleId)
            .query(`INSERT INTO VaiTroNguoiDung (MaNguoiDung, MaVaiTro) VALUES (@userId, @roleId)`);

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
            .query(`SELECT Id FROM NguoiDung WHERE Email = @email OR TenDangNhap = @username`);

        if (check.recordset.length > 0) {
            return res.status(400).json({ error: "Email hoặc tên đăng nhập đã tồn tại." });
        }

        // 2. Hash mật khẩu và tạo tài khoản, lấy lại Id vừa tạo
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await pool.request()
            .input("TenDangNhap", sql.NVarChar, username)
            .input("MatKhau", sql.NVarChar, hashedPassword)
            .input("Email", sql.NVarChar, email)
            .input("SoDienThoai", sql.NVarChar, phone)
            .query(`
                INSERT INTO NguoiDung (TenDangNhap, MatKhau, Email, SoDienThoai)
                OUTPUT INSERTED.Id
                VALUES (@TenDangNhap, @MatKhau, @Email, @SoDienThoai)
            `);

        const newUserId = userResult.recordset[0].Id;

        // 3. Tìm RoleId của role "Candidate"
        const roleResult = await pool.request()
            .input("roleName", sql.NVarChar, "Candidate")
            .query(`SELECT MaVaiTro AS RoleId FROM VaiTro WHERE TenVaiTro = @roleName`);

        if (roleResult.recordset.length > 0) {
            const roleId = roleResult.recordset[0].RoleId;

            // 4. Gán role Candidate vào UserRoles
            await pool.request()
                .input("userId", sql.Int, newUserId)
                .input("roleId", sql.Int, roleId)
                .query(`INSERT INTO VaiTroNguoiDung (MaNguoiDung, MaVaiTro) VALUES (@userId, @roleId)`);
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
                SELECT u.Id, u.TenDangNhap AS Username, u.MatKhau AS Password, u.TrangThai AS Status, r.TenVaiTro AS RoleName
                FROM NguoiDung u
                LEFT JOIN VaiTroNguoiDung ur ON u.Id = ur.MaNguoiDung
                LEFT JOIN VaiTro r ON ur.MaVaiTro = r.MaVaiTro
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
            .input("TrangThai", sql.NVarChar, 'Approved')
            .query(`
                UPDATE NguoiDung 
                SET TrangThai = @TrangThai
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
            .input("TrangThai", sql.NVarChar, 'rejected')
            .query(`
                UPDATE NguoiDung 
                SET TrangThai = @TrangThai
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
            SELECT u.Id, u.TenDangNhap AS Username, u.Email, u.TrangThai AS Status, u.NgayTao AS CreatedAt, r.TenVaiTro AS RoleName
            FROM NguoiDung u
            LEFT JOIN VaiTroNguoiDung ur ON u.Id = ur.MaNguoiDung
            LEFT JOIN VaiTro r ON ur.MaVaiTro = r.MaVaiTro
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
                SELECT Id, TenDangNhap AS Username, Email, SoDienThoai AS Phone, DiaChi AS Address, AnhDaiDien AS AvatarUrl
                FROM NguoiDung WHERE Id = @Id
            `);
        if (result.recordset.length === 0)
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Lỗi getProfile:', err);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

// Cập nhật phone, address, avatar
exports.updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { phone, address, username, avatarUrl } = req.body;
    try {
        await poolConnect;
        await pool.request()
            .input('Id',          sql.Int,      Number(userId))
            .input('SoDienThoai', sql.NVarChar,  phone      || null)
            .input('DiaChi',      sql.NVarChar,  address    || null)
            .input('TenDangNhap', sql.NVarChar,  username   || null)
            .input('AnhDaiDien',  sql.NVarChar,  avatarUrl  !== undefined ? avatarUrl : null)
            .query(`UPDATE NguoiDung SET 
                SoDienThoai = @SoDienThoai, 
                DiaChi = @DiaChi, 
                TenDangNhap = COALESCE(@TenDangNhap, TenDangNhap),
                AnhDaiDien = CASE WHEN @AnhDaiDien IS NOT NULL THEN @AnhDaiDien ELSE AnhDaiDien END
            WHERE Id = @Id`);
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        console.error('Lỗi updateProfile:', err);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
        return res.status(400).json({ error: 'Vui lòng nhập đủ mật khẩu cũ và mật khẩu mới.' });
    if (newPassword.length < 6)
        return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    try {
        await poolConnect;
        const result = await pool.request()
            .input('Id', sql.Int, Number(userId))
            .query(`SELECT MatKhau AS Password FROM NguoiDung WHERE Id = @Id`);
        if (result.recordset.length === 0)
            return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
        const isMatch = await bcrypt.compare(currentPassword, result.recordset[0].Password);
        if (!isMatch)
            return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng.' });
        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.request()
            .input('Id',      sql.Int,     Number(userId))
            .input('MatKhau', sql.NVarChar, hashed)
            .query(`UPDATE NguoiDung SET MatKhau = @MatKhau WHERE Id = @Id`);
        res.json({ message: 'Đổi mật khẩu thành công!' });
    } catch (err) {
        console.error('Lỗi changePassword:', err);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

// Khóa/Vô hiệu hóa người dùng (Status = 'locked')
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        await poolConnect;
        await pool.request()
            .input('Id', sql.Int, Number(userId))
            .query(`UPDATE NguoiDung SET TrangThai = 'locked' WHERE Id = @Id`);
        res.json({ message: 'Đã khóa tài khoản người dùng thành công!' });
    } catch (err) {
        console.error('Lỗi deleteUser:', err);
        res.status(500).json({ error: 'Lỗi hệ thống khi khóa người dùng.' });
    }
};

// ============================================================
// SOCIAL LOGIN: Đăng nhập bằng Google hoặc LinkedIn
// POST /api/auth/social-login
// Body: { provider: 'google' | 'linkedin', accessToken: '...' }
// ============================================================
exports.socialLogin = async (req, res) => {
    const { provider, accessToken } = req.body;

    if (!provider || !accessToken) {
        return res.status(400).json({ error: 'Thiếu provider hoặc accessToken.' });
    }

    let socialEmail = null;
    let socialName = null;
    let socialId = null;

    try {
        // ──── XÁC MINH TOKEN THEO TỪNG PROVIDER ────
        if (provider === 'google') {
            // Gọi Google tokeninfo để lấy thông tin user
            const googleRes = await axios.get(
                `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
            );
            const info = googleRes.data;
            if (!info.email) throw new Error('Không lấy được email từ Google.');
            socialEmail = info.email;
            socialName  = info.name || info.email.split('@')[0];
            socialId    = info.sub; // Google user ID

        } else if (provider === 'linkedin') {
            // Gọi LinkedIn API lấy profile
            const [profileRes, emailRes] = await Promise.all([
                axios.get('https://api.linkedin.com/v2/me', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }),
                axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
            ]);
            socialId   = profileRes.data.id;
            socialName = `${profileRes.data.localizedFirstName} ${profileRes.data.localizedLastName}`.trim();
            const emailElement = emailRes.data.elements?.[0]?.['handle~']?.emailAddress;
            if (!emailElement) throw new Error('Không lấy được email từ LinkedIn.');
            socialEmail = emailElement;

        } else {
            return res.status(400).json({ error: 'Provider không hợp lệ. Chỉ hỗ trợ google hoặc linkedin.' });
        }

        // ──── KIỂM TRA / TẠO USER TRONG DATABASE ────
        await poolConnect;

        // Tìm user theo email
        const existResult = await pool.request()
            .input('Email', sql.NVarChar, socialEmail)
            .query(`
                SELECT u.Id, u.TenDangNhap AS Username, u.TrangThai AS Status, r.TenVaiTro AS RoleName
                FROM NguoiDung u
                LEFT JOIN VaiTroNguoiDung ur ON u.Id = ur.MaNguoiDung
                LEFT JOIN VaiTro r ON ur.MaVaiTro = r.MaVaiTro
                WHERE u.Email = @Email
            `);

        let userId, username, roles;

        if (existResult.recordset.length > 0) {
            // User đã tồn tại → lấy thông tin
            const firstRow = existResult.recordset[0];
            userId   = firstRow.Id;
            username = firstRow.Username;
            roles    = existResult.recordset.map(r => r.RoleName).filter(Boolean);

            // Chặn Employer đăng nhập qua social login trên trang này
            if (roles.includes('Employer')) {
                return res.status(403).json({
                    error: 'Tài khoản nhà tuyển dụng vui lòng sử dụng trang đăng nhập riêng.'
                });
            }
        } else {
            // Tạo user mới từ thông tin social
            const safeUsername = socialName.replace(/\s+/g, '_').substring(0, 50);
            const randomPass   = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10);

            const insertResult = await pool.request()
                .input('TenDangNhap', sql.NVarChar, safeUsername)
                .input('MatKhau', sql.NVarChar, randomPass)
                .input('Email',    sql.NVarChar, socialEmail)
                .query(`
                    INSERT INTO NguoiDung (TenDangNhap, MatKhau, Email, TrangThai, NgayTao)
                    OUTPUT INSERTED.Id
                    VALUES (@TenDangNhap, @MatKhau, @Email, 'active', GETDATE())
                `);

            userId   = insertResult.recordset[0].Id;
            username = safeUsername;

            // Gán role Candidate
            const roleResult = await pool.request()
                .input('TenVaiTro', sql.NVarChar, 'Candidate')
                .query(`SELECT MaVaiTro AS RoleId FROM VaiTro WHERE TenVaiTro = @TenVaiTro`);

            if (roleResult.recordset.length > 0) {
                const roleId = roleResult.recordset[0].RoleId;
                await pool.request()
                    .input('MaNguoiDung', sql.Int, userId)
                    .input('MaVaiTro', sql.Int, roleId)
                    .query(`INSERT INTO VaiTroNguoiDung (MaNguoiDung, MaVaiTro) VALUES (@MaNguoiDung, @MaVaiTro)`);
            }
            roles = ['Candidate'];
        }

        // ──── TẠO JWT VÀ TRẢ VỀ ────
        const token = jwt.sign(
            { id: userId, username, roles },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            message: 'Đăng nhập thành công qua ' + provider,
            token,
            id: userId,
            username,
            roles
        });

    } catch (err) {
        console.error('Lỗi socialLogin:', err.message);
        // Lỗi từ provider (token sai, hết hạn...)
        if (err.response?.status === 400 || err.response?.status === 401) {
            return res.status(401).json({ error: 'Token xác thực không hợp lệ hoặc đã hết hạn.' });
        }
        res.status(500).json({ error: 'Lỗi hệ thống khi đăng nhập bằng mạng xã hội.' });
    }
};

// ============================================================
// LINKEDIN CALLBACK: Đổi authorization code → access token
// POST /api/auth/linkedin-callback
// Body: { code: '...' }
// LinkedIn không cho phép dùng implicit flow nên cần server exchange
// ============================================================
exports.linkedInCallback = async (req, res) => {
    const { code } = req.body;

    const LINKEDIN_CLIENT_ID     = process.env.LINKEDIN_CLIENT_ID     || 'YOUR_LINKEDIN_CLIENT_ID';
    const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_LINKEDIN_CLIENT_SECRET';
    const LINKEDIN_REDIRECT_URI  = process.env.LINKEDIN_REDIRECT_URI  || 'http://localhost:5173/auth/linkedin/callback';

    if (!code) {
        return res.status(400).json({ error: 'Thiếu authorization code.' });
    }

    try {
        // 1. Đổi code lấy access_token
        const tokenRes = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type:    'authorization_code',
                code,
                client_id:     LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET,
                redirect_uri:  LINKEDIN_REDIRECT_URI,
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const linkedInAccessToken = tokenRes.data.access_token;

        // 2. Dùng lại socialLogin logic với LinkedIn token
        req.body = { provider: 'linkedin', accessToken: linkedInAccessToken };
        return exports.socialLogin(req, res);

    } catch (err) {
        console.error('Lỗi linkedInCallback:', err.response?.data || err.message);
        res.status(500).json({ error: 'Không thể xác thực với LinkedIn. Vui lòng thử lại.' });
    }
};

// ============================================================
// GOOGLE CALLBACK: Đổi authorization code → tokens → user info
// POST /api/auth/google-callback
// Body: { code: '...' }
// Không cần Firebase - dùng Google OAuth 2.0 trực tiếp
// ============================================================
exports.googleCallback = async (req, res) => {
    const { code } = req.body;

    const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID     || 'YOUR_GOOGLE_CLIENT_ID';
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
    const GOOGLE_REDIRECT_URI  = process.env.GOOGLE_REDIRECT_URI  || 'http://localhost:5173/auth/google/callback';

    if (!code) {
        return res.status(400).json({ error: 'Thiếu authorization code.' });
    }

    try {
        // 1. Đổi code lấy access_token + id_token
        const tokenRes = await axios.post(
            'https://oauth2.googleapis.com/token',
            new URLSearchParams({
                code,
                client_id:     GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri:  GOOGLE_REDIRECT_URI,
                grant_type:    'authorization_code',
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = tokenRes.data;

        // 2. Lấy thông tin user từ Google userinfo endpoint
        const userInfoRes = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const { email, name } = userInfoRes.data;

        if (!email) {
            return res.status(400).json({ error: 'Không lấy được email từ Google.' });
        }

        // 3. Tìm hoặc tạo user trong SQL Server
        await poolConnect;

        const existResult = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query(`
                SELECT u.Id, u.TenDangNhap AS Username, u.TrangThai AS Status, r.TenVaiTro AS RoleName
                FROM NguoiDung u
                LEFT JOIN VaiTroNguoiDung ur ON u.Id = ur.MaNguoiDung
                LEFT JOIN VaiTro r ON ur.MaVaiTro = r.MaVaiTro
                WHERE u.Email = @Email
            `);

        let userId, username, roles;

        if (existResult.recordset.length > 0) {
            // User đã tồn tại → đăng nhập
            const firstRow = existResult.recordset[0];
            userId   = firstRow.Id;
            username = firstRow.Username;
            roles    = existResult.recordset.map(r => r.RoleName).filter(Boolean);

            if (roles.includes('Employer')) {
                return res.status(403).json({
                    error: 'Tài khoản nhà tuyển dụng vui lòng sử dụng trang đăng nhập riêng.'
                });
            }
        } else {
            // Tạo user mới
            const safeUsername = (name || email.split('@')[0]).replace(/\s+/g, '_').substring(0, 50);
            const randomPass   = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10);

            const insertResult = await pool.request()
                .input('TenDangNhap', sql.NVarChar, safeUsername)
                .input('MatKhau', sql.NVarChar, randomPass)
                .input('Email',    sql.NVarChar, email)
                .query(`
                    INSERT INTO NguoiDung (TenDangNhap, MatKhau, Email, TrangThai, NgayTao)
                    OUTPUT INSERTED.Id
                    VALUES (@TenDangNhap, @MatKhau, @Email, 'active', GETDATE())
                `);

            userId   = insertResult.recordset[0].Id;
            username = safeUsername;

            // Gán role Candidate
            const roleResult = await pool.request()
                .input('TenVaiTro', sql.NVarChar, 'Candidate')
                .query(`SELECT MaVaiTro AS RoleId FROM VaiTro WHERE TenVaiTro = @TenVaiTro`);

            if (roleResult.recordset.length > 0) {
                const roleId = roleResult.recordset[0].RoleId;
                await pool.request()
                    .input('MaNguoiDung', sql.Int, userId)
                    .input('MaVaiTro', sql.Int, roleId)
                    .query(`INSERT INTO VaiTroNguoiDung (MaNguoiDung, MaVaiTro) VALUES (@MaNguoiDung, @MaVaiTro)`);
            }
            roles = ['Candidate'];
        }

        // 4. Tạo JWT hệ thống và trả về
        const token = jwt.sign(
            { id: userId, username, roles },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            message: 'Đăng nhập Google thành công',
            token,
            id: userId,
            username,
            roles
        });

    } catch (err) {
        console.error('Lỗi googleCallback:', err.response?.data || err.message);
        res.status(500).json({ error: 'Không thể xác thực với Google. Vui lòng thử lại.' });
    }
};