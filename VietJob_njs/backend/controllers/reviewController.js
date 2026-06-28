const { sql, pool, poolConnect } = require("../config/db");

async function ensureTable() {
    await poolConnect;
    await pool.request().query(`
        IF NOT EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME = 'DanhGiaCongTy'
        )
        BEGIN
            CREATE TABLE DanhGiaCongTy (
                Id              INT PRIMARY KEY IDENTITY(1,1),
                MaCongTy       INT NOT NULL,
                MaNguoiDung          INT NULL,
                DanhGia          INT NOT NULL CHECK (DanhGia BETWEEN 1 AND 5),
                TomTat         NVARCHAR(500) NOT NULL,
                ChinhSachTangCa  NVARCHAR(50)  NULL,
                LyDoTangCa  NVARCHAR(1000) NULL,
                DiemYeuThich     NVARCHAR(MAX)  NULL,
                GopY      NVARCHAR(MAX)  NULL,
                NgayTao       DATETIME DEFAULT GETDATE()
            )
        END
    `);
}

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
            .input("MaCongTy",       sql.Int,      Number(companyId))
            .input("MaNguoiDung",    sql.Int,      userId ? Number(userId) : null)
            .input("DanhGia",        sql.Int,      Number(rating))
            .input("TomTat",         sql.NVarChar,  summary)
            .input("ChinhSachTangCa", sql.NVarChar,  overtimePolicy  || null)
            .input("LyDoTangCa",     sql.NVarChar,  overtimeReason  || null)
            .input("DiemYeuThich",   sql.NVarChar,  loveWorking     || null)
            .input("GopY",           sql.NVarChar,  suggestion      || null)
            .query(`
                INSERT INTO DanhGiaCongTy
                    (MaCongTy, MaNguoiDung, DanhGia, TomTat, ChinhSachTangCa, LyDoTangCa, DiemYeuThich, GopY)
                OUTPUT INSERTED.Id
                VALUES
                    (@MaCongTy, @MaNguoiDung, @DanhGia, @TomTat, @ChinhSachTangCa, @LyDoTangCa, @DiemYeuThich, @GopY)
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

exports.getReviews = async (req, res) => {
    const { companyId } = req.params;
    try {
        await ensureTable();
        const result = await pool.request()
            .input("MaCongTy", sql.Int, Number(companyId))
            .query(`
                SELECT r.Id, r.DanhGia AS Rating, r.TomTat AS Summary, r.ChinhSachTangCa AS OvertimePolicy,
                       r.LyDoTangCa AS OvertimeReason, r.DiemYeuThich AS LoveWorking, r.GopY AS Suggestion, r.NgayTao AS CreatedAt,
                       u.TenDangNhap AS Username
                FROM DanhGiaCongTy r
                LEFT JOIN NguoiDung u ON r.MaNguoiDung = u.Id
                WHERE r.MaCongTy = @MaCongTy
                ORDER BY r.NgayTao DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error("getReviews:", err);
        res.status(500).json({ error: "Lỗi hệ thống." });
    }
};

exports.getReviewStats = async (req, res) => {
    const { companyId } = req.params;
    try {
        await ensureTable();
        const result = await pool.request()
            .input("MaCongTy", sql.Int, Number(companyId))
            .query(`
                SELECT
                    COUNT(*)        AS TotalReviews,
                    AVG(CAST(DanhGia AS FLOAT)) AS AvgRating
                FROM DanhGiaCongTy
                WHERE MaCongTy = @MaCongTy
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
