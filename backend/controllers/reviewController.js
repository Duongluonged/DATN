const { sql, pool, poolConnect } = require("../config/db");

// ── Tự tạo bảng CompanyReviews nếu chưa có ────────────────────────────────────
async function ensureTable() {
    await poolConnect;
    await pool.request().query(`
        IF NOT EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME = 'CompanyReviews'
        )
        BEGIN
            CREATE TABLE CompanyReviews (
                Id              INT PRIMARY KEY IDENTITY(1,1),
                CompanyId       INT NOT NULL,
                UserId          INT NULL,
                Rating          INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
                Summary         NVARCHAR(500) NOT NULL,
                OvertimePolicy  NVARCHAR(50)  NULL,
                OvertimeReason  NVARCHAR(1000) NULL,
                LoveWorking     NVARCHAR(MAX)  NULL,
                Suggestion      NVARCHAR(MAX)  NULL,
                CreatedAt       DATETIME DEFAULT GETDATE()
            )
        END
    `);
}

// ── POST /api/reviews ──────────────────────────────────────────────────────────
exports.createReview = async (req, res) => {
    const {
        companyId, userId, rating, summary,
        overtimePolicy, overtimeReason, loveWorking, suggestion
    } = req.body;

    if (!companyId || !rating || !summary) {
        return res.status(400).json({ error: "Thiếu thông tin bắt buộc." });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Điểm đánh giá phải từ 1 đến 5." });
    }

    try {
        await ensureTable();
        const result = await pool.request()
            .input("CompanyId",      sql.Int,      Number(companyId))
            .input("UserId",         sql.Int,      userId ? Number(userId) : null)
            .input("Rating",         sql.Int,      Number(rating))
            .input("Summary",        sql.NVarChar,  summary)
            .input("OvertimePolicy", sql.NVarChar,  overtimePolicy  || null)
            .input("OvertimeReason", sql.NVarChar,  overtimeReason  || null)
            .input("LoveWorking",    sql.NVarChar,  loveWorking     || null)
            .input("Suggestion",     sql.NVarChar,  suggestion      || null)
            .query(`
                INSERT INTO CompanyReviews
                    (CompanyId, UserId, Rating, Summary, OvertimePolicy, OvertimeReason, LoveWorking, Suggestion)
                OUTPUT INSERTED.Id
                VALUES
                    (@CompanyId, @UserId, @Rating, @Summary, @OvertimePolicy, @OvertimeReason, @LoveWorking, @Suggestion)
            `);

        res.status(201).json({
            id: result.recordset[0].Id,
            message: "Gửi đánh giá thành công!"
        });
    } catch (err) {
        console.error("createReview:", err);
        res.status(500).json({ error: "Lỗi hệ thống khi lưu đánh giá." });
    }
};

// ── GET /api/reviews/:companyId ────────────────────────────────────────────────
exports.getReviews = async (req, res) => {
    const { companyId } = req.params;
    try {
        await ensureTable();
        const result = await pool.request()
            .input("CompanyId", sql.Int, Number(companyId))
            .query(`
                SELECT r.Id, r.Rating, r.Summary, r.OvertimePolicy,
                       r.OvertimeReason, r.LoveWorking, r.Suggestion, r.CreatedAt,
                       u.Username
                FROM CompanyReviews r
                LEFT JOIN Users u ON r.UserId = u.Id
                WHERE r.CompanyId = @CompanyId
                ORDER BY r.CreatedAt DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error("getReviews:", err);
        res.status(500).json({ error: "Lỗi hệ thống." });
    }
};

// ── GET /api/reviews/:companyId/stats ─────────────────────────────────────────
exports.getReviewStats = async (req, res) => {
    const { companyId } = req.params;
    try {
        await ensureTable();
        const result = await pool.request()
            .input("CompanyId", sql.Int, Number(companyId))
            .query(`
                SELECT
                    COUNT(*)        AS TotalReviews,
                    AVG(CAST(Rating AS FLOAT)) AS AvgRating
                FROM CompanyReviews
                WHERE CompanyId = @CompanyId
            `);
        const row = result.recordset[0];
        res.json({
            totalReviews: row.TotalReviews || 0,
            avgRating:    row.AvgRating    ? Math.round(row.AvgRating * 10) / 10 : 0
        });
    } catch (err) {
        console.error("getReviewStats:", err);
        res.status(500).json({ error: "Lỗi hệ thống." });
    }
};
