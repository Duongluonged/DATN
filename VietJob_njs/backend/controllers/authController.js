
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, pool, poolConnect } = require("../config/db");
const JWT_SECRET = "BiMatVietJob2026";
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

    if (!username || !email || !password || !name) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();

        const check = await new sql.Request(transaction)
            .input('email', sql.NVarChar, email)
            .input('username', sql.NVarChar, username)
            .query(`SELECT Id FROM NguoiDung WHERE Email = @email OR TenDangNhap = @username`);

        if (check.recordset.length > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Email hoặc tên đăng nhập đã tồn tại' });
        }

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


exports.register = async (req, res) => {
    try {
        await poolConnect;
        const { username, password, email, phone } = req.body;

        if (!username || !password || !email || !phone) {
            return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin bao gồm số điện thoại." });
        }

        const check = await pool.request()
            .input("email", sql.NVarChar, email)
            .input("username", sql.NVarChar, username)
            .query(`SELECT Id FROM NguoiDung WHERE Email = @email OR TenDangNhap = @username`);

        if (check.recordset.length > 0) {
            return res.status(400).json({ error: "Email hoặc tên đăng nhập đã tồn tại." });
        }

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

        const roleResult = await pool.request()
            .input("roleName", sql.NVarChar, "Candidate")
            .query(`SELECT MaVaiTro AS RoleId FROM VaiTro WHERE TenVaiTro = @roleName`);

        if (roleResult.recordset.length > 0) {
            const roleId = roleResult.recordset[0].RoleId;

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

exports.login = async (req, res) => {
    try {
        await poolConnect;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Vui lòng nhập Email và Mật khẩu" });
        }

        const request = new sql.Request(pool);
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

        const isMatch = await bcrypt.compare(password, firstRow.Password);
        if (!isMatch) return res.status(400).json({ error: "Mật khẩu không đúng" });

        const roles = userRows.map(row => row.RoleName).filter(role => role !== null);


        if (roles.includes('Employer')) {
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
        const token = jwt.sign(
            {
                id: firstRow.Id,
                username: firstRow.Username,
                roles: roles
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

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


exports.socialLogin = async (req, res) => {
    const { provider, accessToken } = req.body;

    if (!provider || !accessToken) {
        return res.status(400).json({ error: 'Thiếu provider hoặc accessToken.' });
    }

    let socialEmail = null;
    let socialName = null;
    let socialId = null;

    try {
        if (provider === 'google') {
            const googleRes = await axios.get(
                `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
            );
            const info = googleRes.data;
            if (!info.email) throw new Error('Không lấy được email từ Google.');
            socialEmail = info.email;
            socialName = info.name || info.email.split('@')[0];
            socialId = info.sub;

        } else if (provider === 'linkedin') {
            const [profileRes, emailRes] = await Promise.all([
                axios.get('https://api.linkedin.com/v2/me', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }),
                axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
            ]);
            socialId = profileRes.data.id;
            socialName = `${profileRes.data.localizedFirstName} ${profileRes.data.localizedLastName}`.trim();
            const emailElement = emailRes.data.elements?.[0]?.['handle~']?.emailAddress;
            if (!emailElement) throw new Error('Không lấy được email từ LinkedIn.');
            socialEmail = emailElement;

        } else {
            return res.status(400).json({ error: 'Provider không hợp lệ. Chỉ hỗ trợ google hoặc linkedin.' });
        }

        await poolConnect;

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
            const firstRow = existResult.recordset[0];
            userId = firstRow.Id;
            username = firstRow.Username;
            roles = existResult.recordset.map(r => r.RoleName).filter(Boolean);

            if (roles.includes('Employer')) {
                return res.status(403).json({
                    error: 'Tài khoản nhà tuyển dụng vui lòng sử dụng trang đăng nhập riêng.'
                });
            }
        } else {
            const safeUsername = socialName.replace(/\s+/g, '_').substring(0, 50);
            const randomPass = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10);

            const insertResult = await pool.request()
                .input('TenDangNhap', sql.NVarChar, safeUsername)
                .input('MatKhau', sql.NVarChar, randomPass)
                .input('Email', sql.NVarChar, socialEmail)
                .query(`
                    INSERT INTO NguoiDung (TenDangNhap, MatKhau, Email, TrangThai, NgayTao)
                    OUTPUT INSERTED.Id
                    VALUES (@TenDangNhap, @MatKhau, @Email, 'active', GETDATE())
                `);

            userId = insertResult.recordset[0].Id;
            username = safeUsername;

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
        if (err.response?.status === 400 || err.response?.status === 401) {
            return res.status(401).json({ error: 'Token xác thực không hợp lệ hoặc đã hết hạn.' });
        }
        res.status(500).json({ error: 'Lỗi hệ thống khi đăng nhập bằng mạng xã hội.' });
    }
};


exports.linkedInCallback = async (req, res) => {
    const { code } = req.body;

    const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
    const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_LINKEDIN_CLIENT_SECRET';
    const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5173/auth/linkedin/callback';

    if (!code) {
        return res.status(400).json({ error: 'Thiếu authorization code.' });
    }

    try {
        const tokenRes = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET,
                redirect_uri: LINKEDIN_REDIRECT_URI,
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const linkedInAccessToken = tokenRes.data.access_token;

        req.body = { provider: 'linkedin', accessToken: linkedInAccessToken };
        return exports.socialLogin(req, res);

    } catch (err) {
        console.error('Lỗi linkedInCallback:', err.response?.data || err.message);
        res.status(500).json({ error: 'Không thể xác thực với LinkedIn. Vui lòng thử lại.' });
    }
};


exports.googleCallback = async (req, res) => {
    const { code } = req.body;

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback';

    if (!code) {
        return res.status(400).json({ error: 'Thiếu authorization code.' });
    }

    try {
        const tokenRes = await axios.post(
            'https://oauth2.googleapis.com/token',
            new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = tokenRes.data;

        const userInfoRes = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const { email, name } = userInfoRes.data;

        if (!email) {
            return res.status(400).json({ error: 'Không lấy được email từ Google.' });
        }

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
            const firstRow = existResult.recordset[0];
            userId = firstRow.Id;
            username = firstRow.Username;
            roles = existResult.recordset.map(r => r.RoleName).filter(Boolean);

            if (roles.includes('Employer')) {
                return res.status(403).json({
                    error: 'Tài khoản nhà tuyển dụng vui lòng sử dụng trang đăng nhập riêng.'
                });
            }
        } else {
            const safeUsername = (name || email.split('@')[0]).replace(/\s+/g, '_').substring(0, 50);
            const randomPass = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10);

            const insertResult = await pool.request()
                .input('TenDangNhap', sql.NVarChar, safeUsername)
                .input('MatKhau', sql.NVarChar, randomPass)
                .input('Email', sql.NVarChar, email)
                .query(`
                    INSERT INTO NguoiDung (TenDangNhap, MatKhau, Email, TrangThai, NgayTao)
                    OUTPUT INSERTED.Id
                    VALUES (@TenDangNhap, @MatKhau, @Email, 'active', GETDATE())
                `);

            userId = insertResult.recordset[0].Id;
            username = safeUsername;

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