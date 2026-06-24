const { sql, pool, poolConnect } = require("../config/db");

// ─── Helper: tự động thêm cột CvFilePath, CvFileName nếu chưa tồn tại ─────────
async function ensureCvFileColumns() {
    await poolConnect;
    await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                       WHERE TABLE_NAME = 'CvUngVien' AND COLUMN_NAME = 'DuongDanFileCv')
        BEGIN
            ALTER TABLE dbo.CvUngVien ADD DuongDanFileCv  NVARCHAR(2000) NULL
        END
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                       WHERE TABLE_NAME = 'CvUngVien' AND COLUMN_NAME = 'TenFileCv')
        BEGIN
            ALTER TABLE dbo.CvUngVien ADD TenFileCv  NVARCHAR(500)  NULL
        END
    `);
}

// ─── Helper: lấy hoặc tạo CandidateCv cho user ───────────────────────────────
async function getOrCreateCvId(userId) {
    await poolConnect;
    let result = await pool.request()
        .input("MaNguoiDung", sql.Int, userId)
        .query("SELECT Id FROM dbo.CvUngVien WHERE MaNguoiDung = @MaNguoiDung");

    if (result.recordset.length === 0) {
        result = await pool.request()
            .input("MaNguoiDung", sql.Int, userId)
            .query(`
                INSERT INTO dbo.CvUngVien (MaNguoiDung)
                OUTPUT INSERTED.Id
                VALUES (@MaNguoiDung)
            `);
    }
    return result.recordset[0].Id;
}

// ─── Helper: chuyển YYYY-MM → YYYY-MM-01 (DATE hợp lệ cho SQL Server) ─────────
function toDate(val) {
    if (!val) return null;
    return val.length === 7 ? `${val}-01` : val;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CV CHÍNH (Bio + Skills)
// GET  /api/cv/:userId
// ═══════════════════════════════════════════════════════════════════════════════
exports.getCv = async (req, res) => {
    const { userId } = req.params;
    try {
        await ensureCvFileColumns();
        const result = await pool.request()
            .input("MaNguoiDung", sql.Int, Number(userId))
            .query("SELECT Id, GioiThieu AS Bio, KyNang, DuongDanFileCv AS CvFilePath, TenFileCv AS CvFileName FROM dbo.CvUngVien WHERE MaNguoiDung = @MaNguoiDung");

        if (result.recordset.length === 0) {
            return res.json({ cvId: null, bio: "", skills: "", cvFilePath: null, cvFileName: null });
        }
        const row = result.recordset[0];
        res.json({
            cvId: row.Id,
            bio: row.Bio || "",
            skills: row.Skills || "",
            cvFilePath: row.CvFilePath || null,
            cvFileName: row.CvFileName || null,
        });
    } catch (err) {
        console.error("getCv:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LƯU BIO
// POST /api/cv/:userId/bio   body: { bio }
// ═══════════════════════════════════════════════════════════════════════════════
exports.saveBio = async (req, res) => {
    const { userId } = req.params;
    const { bio } = req.body;
    try {
        const cvId = await getOrCreateCvId(Number(userId));
        await pool.request()
            .input("MaCv", sql.Int, cvId)
            .input("GioiThieu", sql.NVarChar, bio || "")
            .query("UPDATE dbo.CvUngVien SET GioiThieu = @GioiThieu WHERE Id = @MaCv");
        res.json({ message: "Lưu giới thiệu thành công" });
    } catch (err) {
        console.error("saveBio:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LƯU SKILLS (chuỗi "ReactJS, Node.js, ...")
// POST /api/cv/:userId/skills   body: { skills }
// ═══════════════════════════════════════════════════════════════════════════════
exports.saveSkills = async (req, res) => {
    const { userId } = req.params;
    const { skills } = req.body;
    try {
        const cvId = await getOrCreateCvId(Number(userId));
        await pool.request()
            .input("MaCv", sql.Int, cvId)
            .input("KyNang", sql.NVarChar, skills || "")
            .query("UPDATE dbo.CvUngVien SET KyNang = @KyNang WHERE Id = @MaCv");
        res.json({ message: "Lưu kỹ năng thành công" });
    } catch (err) {
        console.error("saveSkills:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HỌC VẤN
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/cv/:userId/education
exports.getEducation = async (req, res) => {
    const { userId } = req.params;
    try {
        await poolConnect;
        const result = await pool.request()
            .input("MaNguoiDung", sql.Int, Number(userId))
            .query(`
                SELECT e.Id, e.TenTruong AS SchoolName, e.ChuyenNganh AS Major, e.NgayBatDau AS StartDate, e.NgayKetThuc AS EndDate
                FROM dbo.HocVanCv e
                JOIN dbo.CvUngVien cv ON e.MaCv = cv.Id
                WHERE cv.MaNguoiDung = @MaNguoiDung
                ORDER BY e.NgayBatDau DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error("getEducation:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// POST /api/cv/:userId/education
exports.addEducation = async (req, res) => {
    const { userId } = req.params;
    const { school, major, from, to } = req.body;
    try {
        const cvId = await getOrCreateCvId(Number(userId));
        const result = await pool.request()
            .input("MaCv", sql.Int, cvId)
            .input("School", sql.NVarChar, school || "")
            .input("ChuyenNganh", sql.NVarChar, major || "")
            .input("NgayBatDau", sql.Date, toDate(from))
            .input("NgayKetThuc", sql.Date, toDate(to))
            .query(`
                INSERT INTO dbo.HocVanCv (MaCv, TenTruong, ChuyenNganh, NgayBatDau, NgayKetThuc)
                OUTPUT INSERTED.Id
                VALUES (@MaCv, @School, @ChuyenNganh, @NgayBatDau, @NgayKetThuc)
            `);
        res.status(201).json({ id: result.recordset[0].Id, message: "Thêm học vấn thành công" });
    } catch (err) {
        console.error("addEducation:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// PUT /api/cv/:userId/education/:id
exports.updateEducation = async (req, res) => {
    const { userId, id } = req.params;
    const { school, major, from, to } = req.body;
    try {
        await poolConnect;
        await pool.request()
            .input("Id", sql.Int, Number(id))
            .input("MaNguoiDung", sql.Int, Number(userId))
            .input("School", sql.NVarChar, school || "")
            .input("ChuyenNganh", sql.NVarChar, major || "")
            .input("NgayBatDau", sql.Date, toDate(from))
            .input("NgayKetThuc", sql.Date, toDate(to))
            .query(`
                UPDATE e SET
                    e.TenTruong = @School,
                    e.ChuyenNganh = @ChuyenNganh,
                    e.NgayBatDau = @NgayBatDau,
                    e.NgayKetThuc = @NgayKetThuc
                FROM dbo.HocVanCv e
                JOIN dbo.CvUngVien cv ON e.MaCv = cv.Id
                WHERE e.Id = @Id AND cv.MaNguoiDung = @MaNguoiDung
            `);
        res.json({ message: "Cập nhật học vấn thành công" });
    } catch (err) {
        console.error("updateEducation:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// DELETE /api/cv/:userId/education/:id
exports.deleteEducation = async (req, res) => {
    const { userId, id } = req.params;
    try {
        await poolConnect;
        await pool.request()
            .input("Id", sql.Int, Number(id))
            .input("MaNguoiDung", sql.Int, Number(userId))
            .query(`
                DELETE e FROM dbo.HocVanCv e
                JOIN dbo.CvUngVien cv ON e.MaCv = cv.Id
                WHERE e.Id = @Id AND cv.MaNguoiDung = @MaNguoiDung
            `);
        res.json({ message: "Đã xóa" });
    } catch (err) {
        console.error("deleteEducation:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// KINH NGHIỆM
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/cv/:userId/experience
exports.getExperience = async (req, res) => {
    const { userId } = req.params;
    try {
        await poolConnect;
        const result = await pool.request()
            .input("MaNguoiDung", sql.Int, Number(userId))
            .query(`
                SELECT ex.Id, ex.TenCongTy AS CompanyName, ex.ViTri AS Position, ex.NgayBatDau AS StartDate, ex.NgayKetThuc AS EndDate, ex.MoTa AS Description
                FROM dbo.KinhNghiemCv ex
                JOIN dbo.CvUngVien cv ON ex.MaCv = cv.Id
                WHERE cv.MaNguoiDung = @MaNguoiDung
                ORDER BY ex.NgayBatDau DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error("getExperience:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// POST /api/cv/:userId/experience
exports.addExperience = async (req, res) => {
    const { userId } = req.params;
    const { company, position, from, to, description } = req.body;
    try {
        const cvId = await getOrCreateCvId(Number(userId));
        const result = await pool.request()
            .input("MaCv", sql.Int, cvId)
            .input("Company", sql.NVarChar, company || "")
            .input("ViTri", sql.NVarChar, position || "")
            .input("NgayBatDau", sql.Date, toDate(from))
            .input("NgayKetThuc", sql.Date, toDate(to))
            .input("Desc", sql.NVarChar, description || null)
            .query(`
                INSERT INTO dbo.KinhNghiemCv (MaCv, TenCongTy, ViTri, NgayBatDau, NgayKetThuc, MoTa)
                OUTPUT INSERTED.Id
                VALUES (@MaCv, @Company, @ViTri, @NgayBatDau, @NgayKetThuc, @Desc)
            `);
        res.status(201).json({ id: result.recordset[0].Id, message: "Thêm kinh nghiệm thành công" });
    } catch (err) {
        console.error("addExperience:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// PUT /api/cv/:userId/experience/:id
exports.updateExperience = async (req, res) => {
    const { userId, id } = req.params;
    const { company, position, from, to, description } = req.body;
    try {
        await poolConnect;
        await pool.request()
            .input("Id", sql.Int, Number(id))
            .input("MaNguoiDung", sql.Int, Number(userId))
            .input("Company", sql.NVarChar, company || "")
            .input("ViTri", sql.NVarChar, position || "")
            .input("NgayBatDau", sql.Date, toDate(from))
            .input("NgayKetThuc", sql.Date, toDate(to))
            .input("Desc", sql.NVarChar, description || null)
            .query(`
                UPDATE ex SET
                    ex.TenCongTy = @Company,
                    ex.ViTri = @ViTri,
                    ex.NgayBatDau = @NgayBatDau,
                    ex.NgayKetThuc = @NgayKetThuc,
                    ex.MoTa = @Desc
                FROM dbo.KinhNghiemCv ex
                JOIN dbo.CvUngVien cv ON ex.MaCv = cv.Id
                WHERE ex.Id = @Id AND cv.MaNguoiDung = @MaNguoiDung
            `);
        res.json({ message: "Cập nhật thành công" });
    } catch (err) {
        console.error("updateExperience:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// DELETE /api/cv/:userId/experience/:id
exports.deleteExperience = async (req, res) => {
    const { userId, id } = req.params;
    try {
        await poolConnect;
        await pool.request()
            .input("Id", sql.Int, Number(id))
            .input("MaNguoiDung", sql.Int, Number(userId))
            .query(`
                DELETE ex FROM dbo.KinhNghiemCv ex
                JOIN dbo.CvUngVien cv ON ex.MaCv = cv.Id
                WHERE ex.Id = @Id AND cv.MaNguoiDung = @MaNguoiDung
            `);
        res.json({ message: "Đã xóa" });
    } catch (err) {
        console.error("deleteExperience:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LƯU FILE CV UPLOAD
// PUT /api/cv/:userId/cv-file   body: { fileUrl, fileName }
// ═══════════════════════════════════════════════════════════════════════════════
exports.saveCvFile = async (req, res) => {
    const { userId } = req.params;
    const { fileUrl, fileName } = req.body;
    if (!fileUrl || !fileName) {
        return res.status(400).json({ error: "Thiếu fileUrl hoặc fileName." });
    }
    try {
        await ensureCvFileColumns();
        const cvId = await getOrCreateCvId(Number(userId));
        await pool.request()
            .input("MaCv", sql.Int, cvId)
            .input("DuongDanFile", sql.NVarChar, fileUrl)
            .input("TenFile", sql.NVarChar, fileName)
            .query(`
                UPDATE dbo.CvUngVien
                SET DuongDanFileCv = @DuongDanFile, TenFileCv = @TenFile
                WHERE Id = @MaCv
            `);
        res.json({ message: "Lưu file CV thành công" });
    } catch (err) {
        console.error("saveCvFile:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// XÓA FILE CV UPLOAD
// DELETE /api/cv/:userId/cv-file
// ═══════════════════════════════════════════════════════════════════════════════
exports.deleteCvFile = async (req, res) => {
    const { userId } = req.params;
    try {
        await ensureCvFileColumns();
        await pool.request()
            .input("MaNguoiDung", sql.Int, Number(userId))
            .query(`
                UPDATE dbo.CvUngVien
                SET DuongDanFileCv = NULL, TenFileCv = NULL
                WHERE MaNguoiDung = @MaNguoiDung
            `);
        res.json({ message: "Đã xóa file CV" });
    } catch (err) {
        console.error("deleteCvFile:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};
