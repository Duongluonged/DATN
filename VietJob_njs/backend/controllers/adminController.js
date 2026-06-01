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