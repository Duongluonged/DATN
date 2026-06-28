const { pool, poolConnect, sql } = require('../config/db');
const nodemailer = require('nodemailer');
const transporter = require('../config/mailer');
const bcrypt = require('bcryptjs');

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

exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { phone, address, username, avatarUrl } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('Id', sql.Int, Number(userId))
      .input('SoDienThoai', sql.NVarChar, phone || null)
      .input('DiaChi', sql.NVarChar, address || null)
      .input('TenDangNhap', sql.NVarChar, username || null)
      .input('AnhDaiDien', sql.NVarChar, avatarUrl !== undefined ? avatarUrl : null)
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
      .input('Id', sql.Int, Number(userId))
      .input('MatKhau', sql.NVarChar, hashed)
      .query(`UPDATE NguoiDung SET MatKhau = @MatKhau WHERE Id = @Id`);
    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    console.error('Lỗi changePassword:', err);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
};

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

exports.approveRecruiter = async (req, res) => {
  const { userId, email } = req.body;

  try {
    await poolConnect;
    const request = new sql.Request(pool);

    await request
      .input("Id", sql.Int, userId)
      .input("TrangThai", sql.NVarChar, 'Approved')
      .query(`
                UPDATE NguoiDung 
                SET TrangThai = @TrangThai
                WHERE Id = @Id
            `);

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

exports.getEmployers = async (req, res) => {
  await poolConnect;
  const { status = 'pending', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.request()
      .input('status', sql.NVarChar, status)
      .input('offset', sql.Int, Number(offset))
      .input('limit', sql.Int, Number(limit))
      .query(`
        SELECT 
          u.Id        AS userId,
          u.TenDangNhap AS Username,
          u.Email,
          u.TrangThai AS Status,
          u.NgayTao AS CreatedAt,
          c.MaCongTy  AS employerId,
          c.TenCongTy AS CompanyName,
          c.DuongDanWebsite AS Website,
          c.DiaDiem   AS Address,
          u.Email     AS ContactEmail,
          c.MoTa      AS Description,
          c.DuongDanLogo AS Logo
        FROM NguoiDung u
        INNER JOIN VaiTroNguoiDung ur ON u.Id = ur.MaNguoiDung
        INNER JOIN VaiTro r      ON ur.MaVaiTro = r.MaVaiTro
        INNER JOIN CongTy c      ON u.MaCongTy = c.MaCongTy
        WHERE r.TenVaiTro = 'Employer'
          AND u.TrangThai = @status
        ORDER BY u.NgayTao DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);


    const countResult = await pool.request()
      .input('status', sql.NVarChar, status)
      .query(`
        SELECT COUNT(*) AS total
        FROM NguoiDung u
        INNER JOIN VaiTroNguoiDung ur ON u.Id = ur.MaNguoiDung
        INNER JOIN VaiTro r      ON ur.MaVaiTro = r.MaVaiTro
        WHERE r.TenVaiTro = 'Employer' AND u.TrangThai = @status
      `);

    res.json({
      data: result.recordset,
      total: countResult.recordset[0].total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  await poolConnect;
  const { id } = req.params;
  const { status, reason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    await pool.request()
      .input('id', sql.Int, Number(id))
      .input('status', sql.NVarChar, status)
      .query(`UPDATE NguoiDung SET TrangThai = @status WHERE Id = @id`);

    const userResult = await pool.request()
      .input('id', sql.Int, Number(id))
      .query(`SELECT Email, TenDangNhap AS Username FROM NguoiDung WHERE Id = @id`);

    const user = userResult.recordset[0];
    if (user) {
      await sendEmail(user.Email, user.Username, status, reason);
    }

    res.json({
      message: status === 'approved'
        ? 'Đã duyệt tài khoản thành công'
        : 'Đã từ chối tài khoản'
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

async function sendEmail(email, username, status, reason) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });

  const isApproved = status === 'approved';
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: isApproved
      ? '✅ Tài khoản nhà tuyển dụng đã được duyệt'
      : '❌ Tài khoản nhà tuyển dụng bị từ chối',
    html: isApproved
      ? `<p>Xin chào <b>${username}</b>,</p>
         <p>Tài khoản nhà tuyển dụng của bạn đã được <b style="color:green">duyệt</b>. 
         Bạn có thể đăng nhập ngay!</p>`
      : `<p>Xin chào <b>${username}</b>,</p>
         <p>Tài khoản của bạn đã bị <b style="color:red">từ chối</b>.</p>
         <p>Lý do: ${reason || 'Không đáp ứng yêu cầu'}</p>`
  });
}


exports.getDashboardStats = async (req, res) => {
  await poolConnect;
  try {

    const usersRes = await pool.request().query(`SELECT COUNT(*) AS total FROM NguoiDung`);
    const totalUsers = usersRes.recordset[0]?.total ?? 0;


    const jobsRes = await pool.request().query(`SELECT COUNT(*) AS total FROM CongViec WHERE TrangThaiHoatDong = 1`);
    const totalJobs = jobsRes.recordset[0]?.total ?? 0;


    const coursesRes = await pool.request().query(
      `SELECT COUNT(*) AS total FROM KhoaHoc WHERE (DaXoa = 0 OR DaXoa IS NULL)`
    );
    const totalCourses = coursesRes.recordset[0]?.total ?? 0;

    const reportsRes = await pool.request().query(
      `SELECT COUNT(*) AS total FROM BaoCaoCongViec WHERE TrangThai = 'Pending'`
    );
    const pendingReports = reportsRes.recordset[0]?.total ?? 0;

    const newUsersRes = await pool.request().query(`
      SELECT COUNT(*) AS total FROM NguoiDung
      WHERE MONTH(ISNULL(NgayTao, GETDATE())) = MONTH(GETDATE()) 
        AND YEAR(ISNULL(NgayTao, GETDATE())) = YEAR(GETDATE())
    `);
    const newUsersThisMonth = newUsersRes.recordset[0]?.total ?? 0;

    let totalCompanies = 0;
    try {
      const r = await pool.request().query(`
        SELECT COUNT(DISTINCT u.MaCongTy) AS total 
        FROM NguoiDung u
        INNER JOIN VaiTroNguoiDung ur ON u.Id = ur.MaNguoiDung
        INNER JOIN VaiTro r ON ur.MaVaiTro = r.MaVaiTro
        WHERE r.TenVaiTro = 'Employer' AND u.TrangThai = 'Approved'
      `);
      totalCompanies = r.recordset[0]?.total ?? 0;
      if (totalCompanies === 0) {
        const r2 = await pool.request().query(`SELECT COUNT(*) AS total FROM CongTy`);
        totalCompanies = r2.recordset[0]?.total ?? 0;
      }
    } catch (e) {
      try {
        const r3 = await pool.request().query(`SELECT COUNT(*) AS total FROM CongTy`);
        totalCompanies = r3.recordset[0]?.total ?? 0;
      } catch (e2) { totalCompanies = 0; }
    }

    let avgSalary = 0;
    try {
      const salaryRes = await pool.request().query(`
        SELECT AVG(CAST(REPLACE(REPLACE(REPLACE(LuongTrungBinh AS AverageSalary, ' triệu', ''), ' - ', '.'), ',', '.') AS FLOAT)) AS avg
        FROM CongTy
        WHERE LuongTrungBinh IS NOT NULL AND LuongTrungBinh != ''
      `);
      avgSalary = Math.round(salaryRes.recordset[0]?.avg ?? 0);
    } catch (e) {
      avgSalary = 0;
    }

    let hotJobs = [];
    try {
      const hotJobsRes = await pool.request().query(`
        SELECT TOP 5
          j.TieuDeCongViec AS title,
          c.TenCongTy AS company,
          j.MaCongViec AS views
        FROM CongViec j
        LEFT JOIN CongTy c ON j.MaCongTy = c.MaCongTy
        ORDER BY j.MaCongViec DESC
      `);
      hotJobs = hotJobsRes.recordset;
    } catch (e) {
      console.warn('Lỗi lấy hotJobs:', e.message);
    }

    let trend = [];
    try {
      const trendRes = await pool.request().query(`
        SELECT
          FORMAT(NgayTao, 'MM/yyyy') AS month,
          COUNT(*) AS value
        FROM CongViec
        WHERE NgayTao >= DATEADD(MONTH, -5, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))
        GROUP BY FORMAT(NgayTao, 'MM/yyyy'), YEAR(NgayTao), MONTH(NgayTao)
        ORDER BY YEAR(NgayTao), MONTH(NgayTao)
      `);
      trend = trendRes.recordset;
    } catch (e) {
      console.warn('Lỗi lấy trend:', e.message);
    }

    res.json({
      totalUsers,
      totalJobs,
      totalCourses,
      totalCompanies,
      avgSalary,
      pendingReports,
      newUsersThisMonth,
      hotJobs,
      trend,
    });
  } catch (err) {
    console.error('Lỗi getDashboardStats:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


exports.getSystemTransactions = async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query(`
      SELECT T.Id, T.TieuDe AS Title, T.SoTien AS Amount, T.LoaiGiaoDich AS Type, T.TrangThai AS Status, T.NgayTao AS CreatedAt, T.MaThamChieu AS RefCode, U.TenDangNhap AS RecruiterName
      FROM GiaoDich T
      LEFT JOIN NguoiDung U ON T.MaNguoiDung = U.Id
      ORDER BY T.NgayTao DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi getSystemTransactions:", err);
    res.status(500).json({ message: "Lỗi server khi lấy giao dịch hệ thống", error: err.message });
  }
};