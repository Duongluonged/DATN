const { sql, pool, poolConnect } = require('../config/db');

const getTopCompanies = async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request().query(`
            SELECT 
                C.MaCongTy AS CompanyID, 
                C.TenCongTy AS CompanyName, 
                C.DuongDanLogo AS LogoURL, 
                C.MoTa AS Description, 
                C.DuongDanWebsite AS WebsiteURL, 
                C.DiaDiem AS Location, 
                C.NoiBat AS IsHot, 
                C.NgayTao AS CreatedAt, 
                C.NganhNghe AS Industry, 
                C.QuyMo AS Size, 
                C.QuocGia AS Country, 
                C.ThoiGianLamViec AS WorkingTime, 
                C.LuongTrungBinh AS AverageSalary, 
                C.DanhGia AS Rating, 
                C.SoLuongDanhGia AS ReviewCount, 
                C.MoTaChiTiet AS LongDescription, 
                C.DuongDayNong AS Hotline, 
                C.AnhVanPhong AS OfficePhotos,
                (SELECT COUNT(*) 
                 FROM CongViec J 
                 WHERE J.MaCongTy = C.MaCongTy AND J.TrangThaiHoatDong = 1) AS JobCount,
                -- Lấy chuỗi KyNang từ một công việc bất kỳ của công ty để hiển thị trên Card
                (SELECT TOP 1 J.KyNang 
                 FROM CongViec J 
                 WHERE J.MaCongTy = C.MaCongTy AND J.TrangThaiHoatDong = 1
                 ORDER BY J.NgayTao DESC) AS CompanySkills
            FROM CongTy C
            WHERE C.NoiBat = 1
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi getTopCompanies:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

const getCompanyDetail = async (req, res) => {
    try {
        await poolConnect;
        const { id } = req.params;
        const result = await pool.request()
            .input('id', id)
            .query(`
                SELECT 
                    C.MaCongTy AS CompanyID, 
                    C.TenCongTy AS CompanyName, 
                    C.DuongDanLogo AS LogoURL, 
                    C.MoTa AS Description, 
                    C.DuongDanWebsite AS WebsiteURL, 
                    C.DiaDiem AS Location, 
                    C.NoiBat AS IsHot, 
                    C.NgayTao AS CreatedAt, 
                    C.NganhNghe AS Industry, 
                    C.QuyMo AS Size, 
                    C.QuocGia AS Country, 
                    C.ThoiGianLamViec AS WorkingTime, 
                    C.LuongTrungBinh AS AverageSalary, 
                    C.DanhGia AS Rating, 
                    C.SoLuongDanhGia AS ReviewCount, 
                    C.MoTaChiTiet AS LongDescription, 
                    C.DuongDayNong AS Hotline, 
                    C.AnhVanPhong AS OfficePhotos, 
                    (SELECT COUNT(*) 
                     FROM CongViec J 
                     WHERE J.MaCongTy = C.MaCongTy AND J.TrangThaiHoatDong = 1) AS JobCount
                FROM CongTy C
                WHERE C.MaCongTy = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy công ty" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};


const getCompanyJobs = async (req, res) => {
    try {
        await poolConnect;
        const { id } = req.params;
        const result = await pool.request()
            .input('id', id)
            .query(`
                SELECT MaCongViec AS JobID, TieuDeCongViec AS JobTitle, MucLuong AS SalaryRange, LoaiCongViec AS JobType, KyNang, KinhNghiem AS Experience, DiaDiem AS Location, QuyenLoi AS Benefits
                FROM CongViec 
                WHERE MaCongTy = @id AND TrangThaiHoatDong = 1
            `);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy danh sách công việc", error: err.message });
    }
};




const getCompanyByEmployer = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    C.MaCongTy AS CompanyID, 
                    C.TenCongTy AS CompanyName, 
                    C.DuongDanLogo AS LogoURL, 
                    C.MoTa AS Description, 
                    C.DuongDanWebsite AS WebsiteURL, 
                    C.DiaDiem AS Location, 
                    C.NoiBat AS IsHot, 
                    C.NgayTao AS CreatedAt, 
                    C.NganhNghe AS Industry, 
                    C.QuyMo AS Size, 
                    C.QuocGia AS Country, 
                    C.ThoiGianLamViec AS WorkingTime, 
                    C.LuongTrungBinh AS AverageSalary, 
                    C.DanhGia AS Rating, 
                    C.SoLuongDanhGia AS ReviewCount, 
                    C.MoTaChiTiet AS LongDescription, 
                    C.DuongDayNong AS Hotline, 
                    C.AnhVanPhong AS OfficePhotos, 
                    U.Email AS EmployerEmail, 
                    U.SoDienThoai AS EmployerPhone, 
                    U.TenDangNhap AS RepresentativeName
                FROM NguoiDung U
                JOIN CongTy C ON U.MaCongTy = C.MaCongTy
                WHERE U.Id = @userId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông tin công ty liên kết với tài khoản này." });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error("❌ Lỗi getCompanyByEmployer:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

const updateCompanyByEmployer = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const {
            companyName, logoURL, description, websiteURL, location,
            industry, size, country, workingTime, averageSalary,
            longDescription, email, phone, representativeName, hotline, officePhotos
        } = req.body;

        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT MaCongTy AS CompanyID FROM NguoiDung WHERE Id = @userId`);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản người dùng." });
        }

        const companyId = userResult.recordset[0].CompanyID;
        if (!companyId) {
            return res.status(404).json({ message: "Tài khoản chưa được liên kết với bất kỳ công ty nào." });
        }

        await pool.request()
            .input('companyId', sql.Int, companyId)
            .input('companyName', sql.NVarChar, companyName)
            .input('logoURL', sql.NVarChar, logoURL || null)
            .input('description', sql.NVarChar, description || null)
            .input('websiteURL', sql.NVarChar, websiteURL || null)
            .input('location', sql.NVarChar, location || null)
            .input('industry', sql.NVarChar, industry || null)
            .input('size', sql.NVarChar, size || null)
            .input('country', sql.NVarChar, country || null)
            .input('workingTime', sql.NVarChar, workingTime || null)
            .input('averageSalary', sql.NVarChar, averageSalary || null)
            .input('longDescription', sql.NVarChar(sql.MAX), longDescription || null)
            .input('hotline', sql.NVarChar, hotline || null)
            .input('officePhotos', sql.NVarChar(sql.MAX), officePhotos || null)
            .query(`
                UPDATE CongTy 
                SET TenCongTy = @companyName,
                    DuongDanLogo = @logoURL,
                    MoTa = @description,
                    DuongDanWebsite = @websiteURL,
                    DiaDiem = @location,
                    NganhNghe = @industry,
                    QuyMo = @size,
                    QuocGia = @country,
                    ThoiGianLamViec = @workingTime,
                    LuongTrungBinh = @averageSalary,
                    MoTaChiTiet = @longDescription,
                    DuongDayNong = @hotline,
                    AnhVanPhong = @officePhotos
                WHERE MaCongTy = @companyId
            `);

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone || null)
            .input('username', sql.NVarChar, representativeName)
            .query(`
                UPDATE NguoiDung 
                SET Email = @email,
                    SoDienThoai = @phone,
                    TenDangNhap = @username
                WHERE Id = @userId
            `);

        res.status(200).json({ message: "Cập nhật hồ sơ công ty thành công!" });
    } catch (err) {
        console.error("❌ Lỗi updateCompanyByEmployer:", err);
        res.status(500).json({ message: "Lỗi cập nhật hồ sơ công ty", error: err.message });
    }
};

module.exports = {
    getTopCompanies,
    getCompanyDetail,
    getCompanyJobs,
    getCompanyByEmployer,
    updateCompanyByEmployer
};