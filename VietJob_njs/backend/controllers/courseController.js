const { pool, poolConnect, sql } = require('../config/db');

// ─── 1. Lấy danh sách khóa học của NTD ─────────────────────────
const getCoursesByEmployer = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const { trangThai } = req.query;

        const request = pool.request().input('userId', sql.Int, userId);

        let where = `WHERE k.NhaTuyenDungId = @userId AND (k.IsDeleted = 0 OR k.IsDeleted IS NULL)`;
        if (trangThai && trangThai !== 'all') {
            where += ` AND k.TrangThai = @trangThai`;
            request.input('trangThai', sql.NVarChar, trangThai);
        }

        const result = await request.query(`
            SELECT k.Id, k.TieuDe, k.MoTa, k.TrangThai,
                   k.CreationTime, k.LastModificationTime
            FROM khoa_hoc k
            ${where}
            ORDER BY k.CreationTime DESC
        `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getCoursesByEmployer:', err);
        res.status(500).json({ message: 'Lỗi lấy danh sách khóa học', error: err.message });
    }
};

// ─── 2. Tạo khóa học mới ────────────────────────────────────────
const createCourse = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const { tieuDe, moTa, trangThai } = req.body;

        if (!tieuDe || !tieuDe.trim()) {
            return res.status(400).json({ message: 'Tiêu đề không được để trống.' });
        }

        const result = await pool.request()
            .input('userId',    sql.Int,      userId)
            .input('tieuDe',    sql.NVarChar,  tieuDe.trim())
            .input('moTa',      sql.NVarChar,  moTa || null)
            .input('trangThai', sql.NVarChar,  trangThai || 'Nháp')
            .query(`
                INSERT INTO khoa_hoc (NhaTuyenDungId, TieuDe, MoTa, TrangThai, CreationTime, CreatorUserId, IsDeleted)
                OUTPUT INSERTED.Id
                VALUES (@userId, @tieuDe, @moTa, @trangThai, GETDATE(), @userId, 0)
            `);

        res.status(201).json({ message: 'Tạo khóa học thành công!', id: result.recordset[0]?.Id });
    } catch (err) {
        console.error('❌ Lỗi createCourse:', err);
        res.status(500).json({ message: 'Lỗi tạo khóa học', error: err.message });
    }
};

// ─── 3. Cập nhật khóa học ───────────────────────────────────────
const updateCourse = async (req, res) => {
    try {
        await poolConnect;
        const { courseId } = req.params;
        const { userId } = req.query;
        const { tieuDe, moTa, trangThai } = req.body;

        if (!tieuDe || !tieuDe.trim()) {
            return res.status(400).json({ message: 'Tiêu đề không được để trống.' });
        }

        await pool.request()
            .input('id',        sql.Int,      courseId)
            .input('userId',    sql.Int,      userId)
            .input('tieuDe',    sql.NVarChar,  tieuDe.trim())
            .input('moTa',      sql.NVarChar,  moTa || null)
            .input('trangThai', sql.NVarChar,  trangThai)
            .query(`
                UPDATE khoa_hoc
                SET TieuDe = @tieuDe, MoTa = @moTa, TrangThai = @trangThai,
                    LastModificationTime = GETDATE(), LastModifierUserId = @userId
                WHERE Id = @id AND NhaTuyenDungId = @userId
            `);

        res.status(200).json({ message: 'Cập nhật khóa học thành công!' });
    } catch (err) {
        console.error('❌ Lỗi updateCourse:', err);
        res.status(500).json({ message: 'Lỗi cập nhật khóa học', error: err.message });
    }
};

// ─── 4. Xóa mềm khóa học ────────────────────────────────────────
const deleteCourse = async (req, res) => {
    try {
        await poolConnect;
        const { courseId } = req.params;
        const { userId } = req.query;

        await pool.request()
            .input('id',     sql.Int, courseId)
            .input('userId', sql.Int, userId)
            .query(`
                UPDATE khoa_hoc
                SET IsDeleted = 1, DeleterUserId = @userId, DeletionTime = GETDATE()
                WHERE Id = @id AND NhaTuyenDungId = @userId
            `);

        res.status(200).json({ message: 'Xóa khóa học thành công!' });
    } catch (err) {
        console.error('❌ Lỗi deleteCourse:', err);
        res.status(500).json({ message: 'Lỗi xóa khóa học', error: err.message });
    }
};

module.exports = { getCoursesByEmployer, createCourse, updateCourse, deleteCourse };
