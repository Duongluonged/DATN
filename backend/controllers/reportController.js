const { pool, poolConnect, sql } = require('../config/db');

// ─── 1. Gửi báo cáo tin tuyển dụng vi phạm ───────────────────
const createReport = async (req, res) => {
    try {
        await poolConnect;
        const { jobId, userId, reason, description } = req.body;

        if (!jobId || !reason) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (jobId, reason).' });
        }

        // Thực thi chèn bản ghi vào bảng JobReports
        await pool.request()
            .input('jobId',       sql.Int,      jobId)
            .input('userId',      sql.Int,      userId || null)
            .input('reason',      sql.NVarChar,  reason)
            .input('description', sql.NVarChar,  description || null)
            .query(`
                INSERT INTO JobReports (JobID, UserId, Reason, Description, Status, CreatedAt)
                VALUES (@jobId, @userId, @reason, @description, 'Pending', GETDATE())
            `);

        res.status(201).json({ message: 'Gửi báo cáo tin tuyển dụng vi phạm thành công!' });
    } catch (err) {
        console.error('❌ Lỗi khi gửi báo cáo:', err);
        res.status(500).json({ message: 'Không thể gửi báo cáo vi phạm.', error: err.message });
    }
};

// ─── 2. Lấy toàn bộ danh sách khiếu nại (Dành cho Admin) ──────
const getAllReports = async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request().query(`
            SELECT 
                R.ReportID, R.Reason, R.Description, R.Status, R.CreatedAt,
                J.JobID, J.JobTitle, J.Location,
                C.CompanyName,
                U.Username AS ReporterName, U.Email AS ReporterEmail
            FROM JobReports R
            JOIN Jobs J ON R.JobID = J.JobID
            JOIN Companies C ON J.CompanyID = C.CompanyID
            LEFT JOIN Users U ON R.UserId = U.Id
            ORDER BY R.CreatedAt DESC
        `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách báo cáo:', err);
        res.status(500).json({ message: 'Lỗi lấy danh sách báo cáo vi phạm.', error: err.message });
    }
};

// ─── 3. Cập nhật trạng thái báo cáo (Xử lý khiếu nại) ─────────
const updateReportStatus = async (req, res) => {
    try {
        await poolConnect;
        const { reportId } = req.params;
        const { status } = req.body; // 'Resolved' hoặc 'Ignored'

        if (!status) {
            return res.status(400).json({ message: 'Thiếu trạng thái cập nhật.' });
        }

        await pool.request()
            .input('reportId', sql.Int, reportId)
            .input('status',   sql.NVarChar, status)
            .query(`
                UPDATE JobReports 
                SET Status = @status
                WHERE ReportID = @reportId
            `);

        res.status(200).json({ message: 'Cập nhật trạng thái báo cáo thành công!' });
    } catch (err) {
        console.error('❌ Lỗi updateReportStatus:', err);
        res.status(500).json({ message: 'Không thể cập nhật trạng thái báo cáo.', error: err.message });
    }
};

module.exports = {
    createReport,
    getAllReports,
    updateReportStatus
};
