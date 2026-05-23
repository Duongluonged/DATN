const { sql, pool, poolConnect } = require('../config/db');

const getTopCompanies = async (req, res) => {
    try {
        await poolConnect;
        // Sửa câu lệnh SQL để lồng thêm cột đếm JobCount
        const result = await pool.request().query(`
            SELECT 
                C.*, 
                (SELECT COUNT(*) 
                 FROM Jobs J 
                 WHERE J.CompanyID = C.CompanyID AND J.IsActive = 1) AS JobCount,
                -- Lấy chuỗi Skills từ một công việc bất kỳ của công ty để hiển thị trên Card
                (SELECT TOP 1 J.Skills 
                 FROM Jobs J 
                 WHERE J.CompanyID = C.CompanyID AND J.IsActive = 1
                 ORDER BY J.CreatedAt DESC) AS CompanySkills
            FROM Companies C
            WHERE C.IsHot = 1
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
                    C.*, 
                    -- Đảm bảo có cột AverageSalary hoặc tên tương tự trong bảng Companies
                    C.AverageSalary, 
                    (SELECT COUNT(*) 
                     FROM Jobs J 
                     WHERE J.CompanyID = C.CompanyID AND J.IsActive = 1) AS JobCount
                FROM Companies C
                WHERE C.CompanyID = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy công ty" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};


// Thêm hàm này vào companyController.js
const getCompanyJobs = async (req, res) => {
    try {
        await poolConnect;
        const { id } = req.params; // ID của công ty
        const result = await pool.request()
            .input('id', id)
            .query(`
                SELECT JobID, JobTitle, SalaryRange, JobType, Skills, Experience, Location, Benefits
                FROM Jobs 
                WHERE CompanyID = @id AND IsActive = 1
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
                    C.*, 
                    U.Email AS EmployerEmail, 
                    U.Phone AS EmployerPhone, 
                    U.Username AS RepresentativeName
                FROM Users U
                JOIN Companies C ON U.CompanyID = C.CompanyID
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

        // 1. Tìm CompanyID của User
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT CompanyID FROM Users WHERE Id = @userId`);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản người dùng." });
        }

        const companyId = userResult.recordset[0].CompanyID;
        if (!companyId) {
            return res.status(404).json({ message: "Tài khoản chưa được liên kết với bất kỳ công ty nào." });
        }

        // 2. Cập nhật bảng Companies
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
            .input('longDescription', sql.NVarChar, longDescription || null)
            .input('hotline', sql.NVarChar, hotline || null)
            .input('officePhotos', sql.NVarChar, officePhotos || null)
            .query(`
                UPDATE Companies 
                SET CompanyName = @companyName,
                    LogoURL = @logoURL,
                    Description = @description,
                    WebsiteURL = @websiteURL,
                    Location = @location,
                    Industry = @industry,
                    Size = @size,
                    Country = @country,
                    WorkingTime = @workingTime,
                    AverageSalary = @averageSalary,
                    LongDescription = @longDescription,
                    Hotline = @hotline,
                    OfficePhotos = @officePhotos
                WHERE CompanyID = @companyId
            `);

        // 3. Cập nhật bảng Users
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone || null)
            .input('username', sql.NVarChar, representativeName)
            .query(`
                UPDATE Users 
                SET Email = @email,
                    Phone = @phone,
                    Username = @username
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