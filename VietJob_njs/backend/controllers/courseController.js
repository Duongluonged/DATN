const { pool, poolConnect, sql } = require('../config/db');

const getCoursesByEmployer = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const { trangThai } = req.query;

        const request = pool.request().input('userId', sql.Int, userId);

        let where = `WHERE k.MaNhaTuyenDung = @userId AND (k.DaXoa = 0 OR k.DaXoa IS NULL)`;
        if (trangThai && trangThai !== 'all') {
            where += ` AND k.TrangThai = @trangThai`;
            request.input('trangThai', sql.NVarChar, trangThai);
        }

        const result = await request.query(`
            SELECT k.Id, k.TieuDe, k.MoTa, k.TrangThai,
                   k.ThoiGianTao AS CreationTime, k.ThoiGianCapNhat AS LastModificationTime,
                   k.DanhMuc AS Category, k.DanhGia AS Rating, k.SoLuongDanhGia AS ReviewsCount, k.ThoiLuong AS Duration,
                   k.SoBaiHoc AS LecturesCount, k.TrinhDo AS Level, k.TenGiangVien AS InstructorName, k.VaiTroGiangVien AS InstructorRole,
                   k.Gia AS Price, k.GiaCu AS OldPrice
            FROM KhoaHoc k
            ${where}
            ORDER BY k.ThoiGianTao DESC
        `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getCoursesByEmployer:', err);
        res.status(500).json({ message: 'Lỗi lấy danh sách khóa học', error: err.message });
    }
};

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
                INSERT INTO KhoaHoc (
                    MaNhaTuyenDung, TieuDe, MoTa, TrangThai, ThoiGianTao, MaNguoiTao, DaXoa,
                    DanhMuc, DanhGia, SoLuongDanhGia, ThoiLuong, SoBaiHoc, TrinhDo, 
                    TenGiangVien, VaiTroGiangVien, Gia, GiaCu, DuongDanDrive
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
                UPDATE KhoaHoc
                SET TieuDe = @tieuDe, MoTa = @moTa, TrangThai = @trangThai,
                    DanhMuc = @category, ThoiLuong = @duration, SoBaiHoc = @lecturesCount,
                    TrinhDo = @level, TenGiangVien = @instructorName, VaiTroGiangVien = @instructorRole,
                    Gia = @price, GiaCu = @oldPrice, DuongDanDrive = @driveLink,
                    ThoiGianCapNhat = GETDATE(), MaNguoiCapNhat = @userId
                WHERE Id = @id AND MaNhaTuyenDung = @userId
            `);

        res.status(200).json({ message: 'Cập nhật khóa học thành công!' });
    } catch (err) {
        console.error('❌ Lỗi updateCourse:', err);
        res.status(500).json({ message: 'Lỗi cập nhật khóa học', error: err.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        await poolConnect;
        const { courseId } = req.params;
        const { userId } = req.query;

        await pool.request()
            .input('id',     sql.Int, courseId)
            .input('userId', sql.Int, userId)
            .query(`
                UPDATE KhoaHoc
                SET DaXoa = 1, MaNguoiXoa = @userId, ThoiGianXoa = GETDATE()
                WHERE Id = @id AND MaNhaTuyenDung = @userId
            `);

        res.status(200).json({ message: 'Xóa khóa học thành công!' });
    } catch (err) {
        console.error('❌ Lỗi deleteCourse:', err);
        res.status(500).json({ message: 'Lỗi xóa khóa học', error: err.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request().query(`
            SELECT 
                k.Id, 
                k.TieuDe AS name, 
                u.TenDangNhap AS provider, 
                k.TrangThai AS status, 
                k.ThoiGianTao AS CreationTime,
                k.MoTa,
                k.DanhMuc AS Category, k.DanhGia AS Rating, k.SoLuongDanhGia AS ReviewsCount, k.ThoiLuong AS Duration,
                k.SoBaiHoc AS LecturesCount, k.TrinhDo AS Level, k.TenGiangVien AS InstructorName, k.VaiTroGiangVien AS InstructorRole,
                k.Gia AS Price, k.GiaCu AS OldPrice, k.DuongDanDrive AS DriveLink
            FROM KhoaHoc k
            LEFT JOIN NguoiDung u ON k.MaNhaTuyenDung = u.Id
            WHERE k.DaXoa = 0 OR k.DaXoa IS NULL
            ORDER BY k.ThoiGianTao DESC
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getAllCourses:', err);
        res.status(500).json({ message: 'Lỗi lấy danh sách khóa học', error: err.message });
    }
};

const updateCourseStatus = async (req, res) => {
    try {
        await poolConnect;
        const { courseId } = req.params;
        const { status } = req.body;

        await pool.request()
            .input('id', sql.Int, courseId)
            .input('status', sql.NVarChar, status)
            .query(`
                UPDATE KhoaHoc
                SET TrangThai = @status, ThoiGianCapNhat = GETDATE()
                WHERE Id = @id
            `);

        res.status(200).json({ message: 'Cập nhật trạng thái khóa học thành công!' });
    } catch (err) {
        console.error('❌ Lỗi updateCourseStatus:', err);
        res.status(500).json({ message: 'Lỗi cập nhật trạng thái khóa học', error: err.message });
    }
};

module.exports = { getCoursesByEmployer, createCourse, updateCourse, deleteCourse, getAllCourses, updateCourseStatus };
