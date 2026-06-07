const { sql, pool, poolConnect } = require("../config/db");

// ─── Helper: tự động thêm cột CvFilePath, CvFileName nếu chưa tồn tại ─────────
async function ensureCvFileColumns() {
    await poolConnect;
    await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                       WHERE TABLE_NAME = 'CandidateCv' AND COLUMN_NAME = 'CvFilePath')
        BEGIN
            ALTER TABLE dbo.CandidateCv ADD CvFilePath  NVARCHAR(2000) NULL
        END
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                       WHERE TABLE_NAME = 'CandidateCv' AND COLUMN_NAME = 'CvFileName')
        BEGIN
            ALTER TABLE dbo.CandidateCv ADD CvFileName  NVARCHAR(500)  NULL
        END
    `);
}

// ─── Helper: lấy hoặc tạo CandidateCv cho user ───────────────────────────────
async function getOrCreateCvId(userId) {
    await poolConnect;
    let result = await pool.request()
        .input("UserId", sql.Int, userId)
        .query("SELECT Id FROM dbo.CandidateCv WHERE UserId = @UserId");

    if (result.recordset.length === 0) {
        result = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`
                INSERT INTO dbo.CandidateCv (UserId)
                OUTPUT INSERTED.Id
                VALUES (@UserId)
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
            .input("UserId", sql.Int, Number(userId))
            .query("SELECT Id, Bio, Skills, CvFilePath, CvFileName FROM dbo.CandidateCv WHERE UserId = @UserId");

        if (result.recordset.length === 0) {
            return res.json({ cvId: null, bio: "", skills: "", cvFilePath: null, cvFileName: null });
        }
        const row = result.recordset[0];
        res.json({
            cvId:       row.Id,
            bio:        row.Bio        || "",
            skills:     row.Skills     || "",
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
            .input("CvId", sql.Int, cvId)
            .input("Bio", sql.NVarChar, bio || "")
            .query("UPDATE dbo.CandidateCv SET Bio = @Bio WHERE Id = @CvId");
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
            .input("CvId", sql.Int, cvId)
            .input("Skills", sql.NVarChar, skills || "")
            .query("UPDATE dbo.CandidateCv SET Skills = @Skills WHERE Id = @CvId");
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
            .input("UserId", sql.Int, Number(userId))
            .query(`
                SELECT e.Id, e.SchoolName, e.Major, e.StartDate, e.EndDate
                FROM dbo.CvEducation e
                JOIN dbo.CandidateCv cv ON e.CvId = cv.Id
                WHERE cv.UserId = @UserId
                ORDER BY e.StartDate DESC
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
            .input("CvId", sql.Int, cvId)
            .input("School", sql.NVarChar, school || "")
            .input("Major", sql.NVarChar, major || "")
            .input("StartDate", sql.Date, toDate(from))
            .input("EndDate", sql.Date, toDate(to))
            .query(`
                INSERT INTO dbo.CvEducation (CvId, SchoolName, Major, StartDate, EndDate)
                OUTPUT INSERTED.Id
                VALUES (@CvId, @School, @Major, @StartDate, @EndDate)
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
            .input("UserId", sql.Int, Number(userId))
            .input("School", sql.NVarChar, school || "")
            .input("Major", sql.NVarChar, major || "")
            .input("StartDate", sql.Date, toDate(from))
            .input("EndDate", sql.Date, toDate(to))
            .query(`
                UPDATE e SET
                    e.SchoolName = @School,
                    e.Major = @Major,
                    e.StartDate = @StartDate,
                    e.EndDate = @EndDate
                FROM dbo.CvEducation e
                JOIN dbo.CandidateCv cv ON e.CvId = cv.Id
                WHERE e.Id = @Id AND cv.UserId = @UserId
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
            .input("UserId", sql.Int, Number(userId))
            .query(`
                DELETE e FROM dbo.CvEducation e
                JOIN dbo.CandidateCv cv ON e.CvId = cv.Id
                WHERE e.Id = @Id AND cv.UserId = @UserId
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
            .input("UserId", sql.Int, Number(userId))
            .query(`
                SELECT ex.Id, ex.CompanyName, ex.Position, ex.StartDate, ex.EndDate, ex.Description
                FROM dbo.CvExperience ex
                JOIN dbo.CandidateCv cv ON ex.CvId = cv.Id
                WHERE cv.UserId = @UserId
                ORDER BY ex.StartDate DESC
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
            .input("CvId", sql.Int, cvId)
            .input("Company", sql.NVarChar, company || "")
            .input("Position", sql.NVarChar, position || "")
            .input("StartDate", sql.Date, toDate(from))
            .input("EndDate", sql.Date, toDate(to))
            .input("Desc", sql.NVarChar, description || null)
            .query(`
                INSERT INTO dbo.CvExperience (CvId, CompanyName, Position, StartDate, EndDate, Description)
                OUTPUT INSERTED.Id
                VALUES (@CvId, @Company, @Position, @StartDate, @EndDate, @Desc)
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
            .input("UserId", sql.Int, Number(userId))
            .input("Company", sql.NVarChar, company || "")
            .input("Position", sql.NVarChar, position || "")
            .input("StartDate", sql.Date, toDate(from))
            .input("EndDate", sql.Date, toDate(to))
            .input("Desc", sql.NVarChar, description || null)
            .query(`
                UPDATE ex SET
                    ex.CompanyName = @Company,
                    ex.Position = @Position,
                    ex.StartDate = @StartDate,
                    ex.EndDate = @EndDate,
                    ex.Description = @Desc
                FROM dbo.CvExperience ex
                JOIN dbo.CandidateCv cv ON ex.CvId = cv.Id
                WHERE ex.Id = @Id AND cv.UserId = @UserId
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
            .input("UserId", sql.Int, Number(userId))
            .query(`
                DELETE ex FROM dbo.CvExperience ex
                JOIN dbo.CandidateCv cv ON ex.CvId = cv.Id
                WHERE ex.Id = @Id AND cv.UserId = @UserId
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
            .input("CvId",     sql.Int,      cvId)
            .input("FileUrl",  sql.NVarChar,  fileUrl)
            .input("FileName", sql.NVarChar,  fileName)
            .query(`
                UPDATE dbo.CandidateCv
                SET CvFilePath = @FileUrl, CvFileName = @FileName
                WHERE Id = @CvId
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
            .input("UserId", sql.Int, Number(userId))
            .query(`
                UPDATE dbo.CandidateCv
                SET CvFilePath = NULL, CvFileName = NULL
                WHERE UserId = @UserId
            `);
        res.json({ message: "Đã xóa file CV" });
    } catch (err) {
        console.error("deleteCvFile:", err);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
};
