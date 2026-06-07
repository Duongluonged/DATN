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
                   k.CreationTime, k.LastModificationTime,
                   k.Category, k.Rating, k.ReviewsCount, k.Duration,
                   k.LecturesCount, k.Level, k.InstructorName, k.InstructorRole,
                   k.Price, k.OldPrice
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
        const { 
            tieuDe, moTa, trangThai, category, duration, lecturesCount, 
            level, instructorName, instructorRole, price, oldPrice, driveLink 
        } = req.body;

        if (!tieuDe || !tieuDe.trim()) {
            return res.status(400).json({ message: 'Tiêu đề không được để trống.' });
        }

        const result = await pool.request()
            .input('userId',          sql.Int,       userId)
            .input('tieuDe',          sql.NVarChar,  tieuDe.trim())
            .input('moTa',            sql.NVarChar,  moTa || null)
            .input('trangThai',       sql.NVarChar,  trangThai || 'Nháp')
            .input('category',        sql.NVarChar,  category || 'web')
            .input('rating',          sql.Decimal(2,1), 4.8)
            .input('reviewsCount',    sql.Int,       24)
            .input('duration',        sql.NVarChar,  duration || '45 giờ')
            .input('lecturesCount',    sql.Int,       lecturesCount ? parseInt(lecturesCount) : 50)
            .input('level',           sql.NVarChar,  level || 'Mọi trình độ')
            .input('instructorName',  sql.NVarChar,  instructorName || 'Đỗ Phương Thảo')
            .input('instructorRole',  sql.NVarChar,  instructorRole || 'Đối tác Đào tạo VietJob')
            .input('price',           sql.Int,       price ? parseInt(price) : 1500000)
            .input('oldPrice',        sql.Int,       oldPrice ? parseInt(oldPrice) : 3000000)
            .input('driveLink',       sql.NVarChar,  driveLink || 'https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course')
            .query(`
                INSERT INTO khoa_hoc (
                    NhaTuyenDungId, TieuDe, MoTa, TrangThai, CreationTime, CreatorUserId, IsDeleted,
                    Category, Rating, ReviewsCount, Duration, LecturesCount, Level, 
                    InstructorName, InstructorRole, Price, OldPrice, DriveLink
                )
                OUTPUT INSERTED.Id
                VALUES (
                    @userId, @tieuDe, @moTa, @trangThai, GETDATE(), @userId, 0,
                    @category, @rating, @reviewsCount, @duration, @lecturesCount, @level,
                    @instructorName, @instructorRole, @price, @oldPrice, @driveLink
                )
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
        const { 
            tieuDe, moTa, trangThai, category, duration, lecturesCount, 
            level, instructorName, instructorRole, price, oldPrice, driveLink 
        } = req.body;

        if (!tieuDe || !tieuDe.trim()) {
            return res.status(400).json({ message: 'Tiêu đề không được để trống.' });
        }

        await pool.request()
            .input('id',              sql.Int,       courseId)
            .input('userId',          sql.Int,       userId)
            .input('tieuDe',          sql.NVarChar,  tieuDe.trim())
            .input('moTa',            sql.NVarChar,  moTa || null)
            .input('trangThai',       sql.NVarChar,  trangThai)
            .input('category',        sql.NVarChar,  category || 'web')
            .input('duration',        sql.NVarChar,  duration || '45 giờ')
            .input('lecturesCount',    sql.Int,       lecturesCount ? parseInt(lecturesCount) : 50)
            .input('level',           sql.NVarChar,  level || 'Mọi trình độ')
            .input('instructorName',  sql.NVarChar,  instructorName || 'Đỗ Phương Thảo')
            .input('instructorRole',  sql.NVarChar,  instructorRole || 'Đối tác Đào tạo VietJob')
            .input('price',           sql.Int,       price ? parseInt(price) : 1500000)
            .input('oldPrice',        sql.Int,       oldPrice ? parseInt(oldPrice) : 3000000)
            .input('driveLink',       sql.NVarChar,  driveLink || 'https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course')
            .query(`
                UPDATE khoa_hoc
                SET TieuDe = @tieuDe, MoTa = @moTa, TrangThai = @trangThai,
                    Category = @category, Duration = @duration, LecturesCount = @lecturesCount,
                    Level = @level, InstructorName = @instructorName, InstructorRole = @instructorRole,
                    Price = @price, OldPrice = @oldPrice, DriveLink = @driveLink,
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

// ─── 5. Lấy toàn bộ danh sách khóa học cho Admin & Học viên ──────
const getAllCourses = async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request().query(`
            SELECT 
                k.Id, 
                k.TieuDe AS name, 
                u.Username AS provider, 
                k.TrangThai AS status, 
                k.CreationTime,
                k.MoTa,
                k.Category, k.Rating, k.ReviewsCount, k.Duration,
                k.LecturesCount, k.Level, k.InstructorName, k.InstructorRole,
                k.Price, k.OldPrice, k.DriveLink
            FROM khoa_hoc k
            LEFT JOIN Users u ON k.NhaTuyenDungId = u.Id
            WHERE k.IsDeleted = 0 OR k.IsDeleted IS NULL
            ORDER BY k.CreationTime DESC
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getAllCourses:', err);
        res.status(500).json({ message: 'Lỗi lấy danh sách khóa học', error: err.message });
    }
};

// ─── 6. Admin duyệt khóa học (Cập nhật trạng thái) ────────────
const updateCourseStatus = async (req, res) => {
    try {
        await poolConnect;
        const { courseId } = req.params;
        const { status } = req.body; // e.g., 'Đang mở', 'Đang tuyển sinh', 'Chờ duyệt'

        await pool.request()
            .input('id', sql.Int, courseId)
            .input('status', sql.NVarChar, status)
            .query(`
                UPDATE khoa_hoc
                SET TrangThai = @status, LastModificationTime = GETDATE()
                WHERE Id = @id
            `);

        res.status(200).json({ message: 'Cập nhật trạng thái khóa học thành công!' });
    } catch (err) {
        console.error('❌ Lỗi updateCourseStatus:', err);
        res.status(500).json({ message: 'Lỗi cập nhật trạng thái khóa học', error: err.message });
    }
};

module.exports = { getCoursesByEmployer, createCourse, updateCourse, deleteCourse, getAllCourses, updateCourseStatus };
