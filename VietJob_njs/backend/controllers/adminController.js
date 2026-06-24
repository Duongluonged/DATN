const { pool, poolConnect, sql } = require('../config/db');
const nodemailer = require('nodemailer');

// Lấy danh sách employer theo status
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

    // Đếm tổng
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

// Duyệt hoặc từ chối
exports.updateStatus = async (req, res) => {
  await poolConnect;
  const { id } = req.params;       // userId
  const { status, reason } = req.body;  // 'approved' | 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    await pool.request()
      .input('id', sql.Int, Number(id))
      .input('status', sql.NVarChar, status)
      .query(`UPDATE NguoiDung SET TrangThai = @status WHERE Id = @id`);

    // Lấy email để gửi thông báo
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

// ─── Dashboard Stats ────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  await poolConnect;
  try {
    // 1. Tổng người dùng
    const usersRes = await pool.request().query(`SELECT COUNT(*) AS total FROM NguoiDung`);
    const totalUsers = usersRes.recordset[0]?.total ?? 0;

    // 2. Tổng tin tuyển dụng đang hoạt động
    const jobsRes = await pool.request().query(`SELECT COUNT(*) AS total FROM CongViec WHERE TrangThaiHoatDong = 1`);
    const totalJobs = jobsRes.recordset[0]?.total ?? 0;

    // 3. Tổng khóa học hoạt động
    const coursesRes = await pool.request().query(
      `SELECT COUNT(*) AS total FROM KhoaHoc WHERE (DaXoa = 0 OR DaXoa IS NULL)`
    );
    const totalCourses = coursesRes.recordset[0]?.total ?? 0;

    // 4. Báo cáo chờ xử lý
    const reportsRes = await pool.request().query(
      `SELECT COUNT(*) AS total FROM BaoCaoCongViec WHERE TrangThai = 'Pending'`
    );
    const pendingReports = reportsRes.recordset[0]?.total ?? 0;

    // 5. User mới tháng này
    const newUsersRes = await pool.request().query(`
      SELECT COUNT(*) AS total FROM NguoiDung
      WHERE MONTH(ISNULL(NgayTao, GETDATE())) = MONTH(GETDATE()) 
        AND YEAR(ISNULL(NgayTao, GETDATE())) = YEAR(GETDATE())
    `);
    const newUsersThisMonth = newUsersRes.recordset[0]?.total ?? 0;

    // 6. Tổng số doanh nghiệp
    let totalCompanies = 0;
    try {
      // Đếm các công ty có liên kết với tài khoản nhà tuyển dụng đã được duyệt
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

    // 7. Lương trung bình (lấy từ AverageSalary trong bảng Companies)
    let avgSalary = 0;
    try {
      const salaryRes = await pool.request().query(`
        SELECT AVG(CAST(REPLACE(REPLACE(REPLACE(LuongTrungBinh AS AverageSalary, ' triệu', ''), ' - ', '.'), ',', '.') AS FLOAT)) AS avg
        FROM CongTy
        WHERE LuongTrungBinh IS NOT NULL AND LuongTrungBinh != ''
      `);
      avgSalary = Math.round(salaryRes.recordset[0]?.avg ?? 0);
    } catch (e) {
      // AverageSalary có thể là text không parse được
      avgSalary = 0;
    }

    // 8. Top 5 tin tuyển dụng gần nhất
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

    // 9. Xu hướng đăng tuyển 6 tháng gần nhất
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

// Lấy toàn bộ giao dịch hệ thống (Quản lý doanh thu Admin)
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