const { pool, poolConnect, sql } = require('../config/db');

// ====================================================
// 1. Tìm kiếm việc làm (dành cho ứng viên)
// ====================================================
const searchJobs = async (req, res) => {
    try {
        await poolConnect;
        const { keyword, location, salary, jobType } = req.query;

        const request = pool.request();
        let query = `
            SELECT 
                J.JobID, J.JobTitle, J.Description, J.Skills,
                J.Location, J.SalaryRange, J.JobType, J.JobLevel,
                J.Experience, J.IsActive, J.CreatedAt, J.Benefits,
                J.Requirements, J.Deadline,
                C.CompanyName, C.LogoURL, C.CompanyID
            FROM Jobs J
            JOIN Companies C ON J.CompanyID = C.CompanyID
            WHERE J.IsActive = 1
        `;

        if (keyword && keyword.trim() !== '') {
            query += ` AND (J.JobTitle LIKE @key OR J.Skills LIKE @key OR J.Description LIKE @key)`;
            request.input('key', sql.NVarChar, `%${keyword.trim()}%`);
        }
        if (location && location !== 'Tất cả các địa điểm') {
            query += ` AND J.Location LIKE @loc`;
            request.input('loc', sql.NVarChar, `%${location}%`);
        }
        if (jobType && jobType !== 'all') {
            query += ` AND J.JobType = @type`;
            request.input('type', sql.NVarChar, jobType);
        }
        if (salary && salary !== 'all') {
            const salaryMap = {
                'under10': 'dưới 10',
                '10-20': '10',
                '20-50': '20',
                '50+': '50'
            };
            if (salaryMap[salary]) {
                query += ` AND J.SalaryRange LIKE @salary`;
                request.input('salary', sql.NVarChar, `%${salaryMap[salary]}%`);
            }
        }

        query += ` ORDER BY J.CreatedAt DESC`;
        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi searchJobs:', err);
        res.status(500).json({ message: 'Lỗi tìm kiếm', error: err.message });
    }
};

// ====================================================
// 2. Lấy chi tiết 1 job (public)
// ====================================================
const getJobDetail = async (req, res) => {
    try {
        await poolConnect;
        const { id } = req.params;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    J.*,
                    C.CompanyName, C.LogoURL, C.WebsiteURL, C.Size, C.Industry
                FROM Jobs J
                JOIN Companies C ON J.CompanyID = C.CompanyID
                WHERE J.JobID = @id AND J.IsActive = 1
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy công việc' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('❌ Lỗi getJobDetail:', err);
        res.status(500).json({ message: 'Lỗi lấy chi tiết công việc', error: err.message });
    }
};

// ====================================================
// 3. Lấy danh sách tin của NHÀ TUYỂN DỤNG (theo userId)
// ====================================================
const getJobsByEmployer = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const parsedUserId = parseInt(userId, 10);
        if (isNaN(parsedUserId)) {
            return res.status(400).json({ message: 'Id nhà tuyển dụng không hợp lệ.' });
        }

        const result = await pool.request()
            .input('userId', sql.Int, parsedUserId)
            .query(`
                SELECT 
                    J.JobID, J.JobTitle, J.Location, J.SalaryRange,
                    J.JobType, J.JobLevel, J.Experience, J.Skills,
                    J.Description, J.Requirements, J.Gender, J.IsActive, J.CreatedAt,
                    C.CompanyName,
                    (SELECT COUNT(*) FROM Applications A WHERE A.JobID = J.JobID) AS ApplicantCount
                FROM Jobs J
                JOIN Companies C ON J.CompanyID = C.CompanyID
                JOIN Users U ON U.CompanyID = C.CompanyID
                WHERE U.Id = @userId
                ORDER BY J.CreatedAt DESC
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getJobsByEmployer:', err);
        res.status(500).json({ message: 'Lỗi lấy danh sách tin tuyển dụng', error: err.message });
    }
};

// ====================================================
// 4. Tạo tin tuyển dụng mới
// ====================================================
const createJob = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const parsedUserId = parseInt(userId, 10);
        if (isNaN(parsedUserId)) {
            return res.status(400).json({ message: 'Id nhà tuyển dụng không hợp lệ.' });
        }
        const {
            jobTitle, location, salaryRange, jobType,
            jobLevel, experience, skills, description, requirements, gender
        } = req.body;

        if (!jobTitle || !location || !jobType) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Tên việc, Địa điểm, Loại hình).' });
        }

        // Lấy CompanyID từ userId
        const compResult = await pool.request()
            .input('userId', sql.Int, parsedUserId)
            .query(`SELECT CompanyID FROM Users WHERE Id = @userId`);

        if (compResult.recordset.length === 0 || !compResult.recordset[0].CompanyID) {
            return res.status(404).json({ message: 'Không tìm thấy công ty liên kết với tài khoản này.' });
        }

        const companyId = compResult.recordset[0].CompanyID;

        const insertResult = await pool.request()
            .input('companyId',   sql.Int,      companyId)
            .input('jobTitle',    sql.NVarChar,  jobTitle)
            .input('location',    sql.NVarChar,  location)
            .input('salaryRange', sql.NVarChar,  salaryRange || null)
            .input('jobType',     sql.NVarChar,  jobType)
            .input('jobLevel',    sql.NVarChar,  jobLevel    || null)
            .input('experience',  sql.NVarChar,  experience  || null)
            .input('skills',      sql.NVarChar,  skills      || null)
            .input('description', sql.NVarChar,  description || null)
            .input('requirements', sql.NVarChar, requirements || null)
            .input('gender',      sql.NVarChar,  gender      || 'Không yêu cầu')
            .query(`
                INSERT INTO Jobs (
                    CompanyID, JobTitle, Location, SalaryRange,
                    JobType, JobLevel, Experience, Skills,
                    Description, Requirements, Gender, IsActive, CreatedAt
                )
                OUTPUT INSERTED.JobID
                VALUES (
                    @companyId, @jobTitle, @location, @salaryRange,
                    @jobType, @jobLevel, @experience, @skills,
                    @description, @requirements, @gender, 1, GETDATE()
                )
            `);

        const newJobId = insertResult.recordset[0].JobID;
        res.status(201).json({ message: 'Đăng tin tuyển dụng thành công!', jobId: newJobId });
    } catch (err) {
        console.error('❌ Lỗi createJob:', err);
        res.status(500).json({ message: 'Lỗi tạo tin tuyển dụng', error: err.message });
    }
};

// ====================================================
// 5. Cập nhật tin tuyển dụng
// ====================================================
const updateJob = async (req, res) => {
    try {
        await poolConnect;
        const { jobId } = req.params;
        const {
            jobTitle, location, salaryRange, jobType,
            jobLevel, experience, skills, description, requirements, gender, isActive
        } = req.body;

        await pool.request()
            .input('jobId',       sql.Int,      jobId)
            .input('jobTitle',    sql.NVarChar,  jobTitle)
            .input('location',    sql.NVarChar,  location)
            .input('salaryRange', sql.NVarChar,  salaryRange || null)
            .input('jobType',     sql.NVarChar,  jobType)
            .input('jobLevel',    sql.NVarChar,  jobLevel    || null)
            .input('experience',  sql.NVarChar,  experience  || null)
            .input('skills',      sql.NVarChar,  skills      || null)
            .input('description', sql.NVarChar,  description || null)
            .input('requirements', sql.NVarChar, requirements || null)
            .input('gender',      sql.NVarChar,  gender      || 'Không yêu cầu')
            .input('isActive',    sql.Bit,       isActive !== undefined ? isActive : 1)
            .query(`
                UPDATE Jobs SET
                    JobTitle     = @jobTitle,
                    Location     = @location,
                    SalaryRange  = @salaryRange,
                    JobType      = @jobType,
                    JobLevel     = @jobLevel,
                    Experience   = @experience,
                    Skills       = @skills,
                    Description  = @description,
                    Requirements = @requirements,
                    Gender       = @gender,
                    IsActive     = @isActive
                WHERE JobID = @jobId
            `);

        res.status(200).json({ message: 'Cập nhật tin tuyển dụng thành công!' });
    } catch (err) {
        console.error('❌ Lỗi updateJob:', err);
        res.status(500).json({ message: 'Lỗi cập nhật tin tuyển dụng', error: err.message });
    }
};

// ====================================================
// 6. Xóa / ẩn tin tuyển dụng (soft delete)
// ====================================================
const deleteJob = async (req, res) => {
    try {
        await poolConnect;
        const { jobId } = req.params;

        await pool.request()
            .input('jobId', sql.Int, jobId)
            .query(`UPDATE Jobs SET IsActive = 0 WHERE JobID = @jobId`);

        res.status(200).json({ message: 'Đã ẩn tin tuyển dụng.' });
    } catch (err) {
        console.error('❌ Lỗi deleteJob:', err);
        res.status(500).json({ message: 'Lỗi xóa tin tuyển dụng', error: err.message });
    }
};

module.exports = { searchJobs, getJobDetail, getJobsByEmployer, createJob, updateJob, deleteJob };