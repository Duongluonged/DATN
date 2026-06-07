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
          u.Username,
          u.Email,
          u.Status,
          u.CreatedAt,
          e.Id        AS employerId,
          e.Name      AS CompanyName,
          e.Website,
          e.Address,
          e.ContactEmail,
          e.Description,
          e.Logo
        FROM Users u
        INNER JOIN UserRoles ur ON u.Id = ur.UserId
        INNER JOIN Roles r      ON ur.RoleId = r.RoleId
        INNER JOIN Employers e  ON u.Id = e.UserId
        WHERE r.RoleName = 'Employer'
          AND u.Status = @status
          AND e.IsDeleted = 0
        ORDER BY u.CreatedAt DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);

    // Đếm tổng
    const countResult = await pool.request()
      .input('status', sql.NVarChar, status)
      .query(`
        SELECT COUNT(*) AS total
        FROM Users u
        INNER JOIN UserRoles ur ON u.Id = ur.UserId
        INNER JOIN Roles r      ON ur.RoleId = r.RoleId
        WHERE r.RoleName = 'Employer' AND u.Status = @status
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
      .query(`UPDATE Users SET Status = @status WHERE Id = @id`);

    // Lấy email để gửi thông báo
    const userResult = await pool.request()
      .input('id', sql.Int, Number(id))
      .query(`SELECT Email, Username FROM Users WHERE Id = @id`);

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
    const usersRes = await pool.request().query(`SELECT COUNT(*) AS total FROM Users`);
    const totalUsers = usersRes.recordset[0]?.total ?? 0;

    // 2. Tổng tin tuyển dụng đang hoạt động
    const jobsRes = await pool.request().query(`SELECT COUNT(*) AS total FROM Jobs WHERE IsActive = 1`);
    const totalJobs = jobsRes.recordset[0]?.total ?? 0;

    // 3. Tổng khóa học hoạt động
    const coursesRes = await pool.request().query(
      `SELECT COUNT(*) AS total FROM khoa_hoc WHERE (IsDeleted = 0 OR IsDeleted IS NULL)`
    );
    const totalCourses = coursesRes.recordset[0]?.total ?? 0;

    // 4. Báo cáo chờ xử lý
    const reportsRes = await pool.request().query(
      `SELECT COUNT(*) AS total FROM JobReports WHERE Status = 'Pending'`
    );
    const pendingReports = reportsRes.recordset[0]?.total ?? 0;

    // 5. User mới tháng này
    const newUsersRes = await pool.request().query(`
      SELECT COUNT(*) AS total FROM Users
      WHERE MONTH(ISNULL(CreatedAt, GETDATE())) = MONTH(GETDATE()) 
        AND YEAR(ISNULL(CreatedAt, GETDATE())) = YEAR(GETDATE())
    `);
    const newUsersThisMonth = newUsersRes.recordset[0]?.total ?? 0;

    // 6. Tổng số doanh nghiệp
    let totalCompanies = 0;
    try {
      // Thử đếm Employers đã duyệt
      const r = await pool.request().query(`
        SELECT COUNT(DISTINCT e.Id) AS total FROM Employers e
        INNER JOIN Users u ON e.UserId = u.Id
        WHERE u.Status = 'approved'
      `);
      totalCompanies = r.recordset[0]?.total ?? 0;
      // Nếu 0, thử đếm tất cả Employers
      if (totalCompanies === 0) {
        const r2 = await pool.request().query(`SELECT COUNT(*) AS total FROM Employers`);
        totalCompanies = r2.recordset[0]?.total ?? 0;
      }
    } catch (e) {
      try {
        const r3 = await pool.request().query(`SELECT COUNT(*) AS total FROM Companies`);
        totalCompanies = r3.recordset[0]?.total ?? 0;
      } catch (e2) { totalCompanies = 0; }
    }

    // 7. Lương trung bình (lấy từ AverageSalary trong bảng Companies)
    let avgSalary = 0;
    try {
      const salaryRes = await pool.request().query(`
        SELECT AVG(CAST(REPLACE(REPLACE(REPLACE(AverageSalary, ' triệu', ''), ' - ', '.'), ',', '.') AS FLOAT)) AS avg
        FROM Companies
        WHERE AverageSalary IS NOT NULL AND AverageSalary != ''
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
          j.JobTitle AS title,
          c.CompanyName AS company,
          j.JobID AS views
        FROM Jobs j
        LEFT JOIN Companies c ON j.CompanyID = c.CompanyID
        ORDER BY j.JobID DESC
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
          FORMAT(CreatedAt, 'MM/yyyy') AS month,
          COUNT(*) AS value
        FROM Jobs
        WHERE CreatedAt >= DATEADD(MONTH, -5, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))
        GROUP BY FORMAT(CreatedAt, 'MM/yyyy'), YEAR(CreatedAt), MONTH(CreatedAt)
        ORDER BY YEAR(CreatedAt), MONTH(CreatedAt)
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
      SELECT T.Id, T.Title, T.Amount, T.Type, T.Status, T.CreatedAt, T.RefCode, U.Username AS RecruiterName
      FROM Transactions T
      LEFT JOIN Users U ON T.UserId = U.Id
      ORDER BY T.CreatedAt DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi getSystemTransactions:", err);
    res.status(500).json({ message: "Lỗi server khi lấy giao dịch hệ thống", error: err.message });
  }
};