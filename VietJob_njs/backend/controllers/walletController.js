const { pool, poolConnect, sql } = require('../config/db');

const initializeWalletDB = async () => {
    try {
        await poolConnect;
        
        await pool.request().query(`
            IF NOT EXISTS (
                SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'NguoiDung' AND COLUMN_NAME = 'SoDu'
            )
            BEGIN
                ALTER TABLE NguoiDung ADD SoDu INT NOT NULL DEFAULT 5000000; -- Tặng sẵn 5M VND làm vốn trải nghiệm
            END
        `);

        await pool.request().query(`
            IF NOT EXISTS (
                SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'CongViec' AND COLUMN_NAME = 'NoiBat'
            )
            BEGIN
                ALTER TABLE CongViec ADD NoiBat BIT NOT NULL DEFAULT 0;
            END
        `);

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GiaoDich')
            BEGIN
                CREATE TABLE GiaoDich (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    MaNguoiDung INT NOT NULL,
                    TieuDe NVARCHAR(255) NOT NULL,
                    SoTien INT NOT NULL,
                    LoaiGiaoDich NVARCHAR(50) NOT NULL, -- 'Nap', 'ThanhToan', 'BanKhoaHoc'
                    TrangThai NVARCHAR(50) NOT NULL, -- 'ThanhCong', 'ThatBai'
                    NgayTao DATETIME DEFAULT GETDATE(),
                    MaThamChieu NVARCHAR(100)
                );
            END
        `);

        await pool.request().query(`
            IF NOT EXISTS (
                SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'CongTy' AND COLUMN_NAME = 'NoiBat'
            )
            BEGIN
                ALTER TABLE CongTy ADD NoiBat INT NOT NULL DEFAULT 0;
            END
            ELSE
            BEGIN
                EXEC('UPDATE CongTy SET NoiBat = 0 WHERE NoiBat IS NULL');
            END
        `);

        console.log("✅ Wallet database initialized successfully!");
    } catch (err) {
        console.error("❌ Error initializing wallet DB:", err);
    }
};

initializeWalletDB();

const getWalletInfo = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;

        const userRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT SoDu AS Balance FROM NguoiDung WHERE Id = @userId`);
        
        if (userRes.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const balance = userRes.recordset[0].Balance;

        const transactionsRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT TOP 20 * FROM GiaoDich 
                WHERE MaNguoiDung = @userId 
                ORDER BY NgayTao DESC
            `);

        const jobsRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT J.MaCongViec AS JobID, J.TieuDeCongViec AS JobTitle, J.NoiBat AS IsHighlighted, J.TrangThaiHoatDong AS IsActive
                FROM CongViec J
                JOIN NguoiDung U ON J.MaCongTy = U.MaCongTy
                WHERE U.Id = @userId AND J.TrangThaiHoatDong = 1
            `);

        res.status(200).json({
            balance,
            transactions: transactionsRes.recordset,
            jobs: jobsRes.recordset
        });
    } catch (err) {
        console.error("Lỗi getWalletInfo:", err);
        res.status(500).json({ message: "Lỗi lấy thông tin ví", error: err.message });
    }
};

const depositMoney = async (req, res) => {
    try {
        await poolConnect;
        const { userId, amount, bankName } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Số tiền nạp không hợp lệ" });
        }

        const refCode = "NAP" + Math.floor(1000000 + Math.random() * 9000000);

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('amount', sql.Int, amount)
            .query(`UPDATE NguoiDung SET SoDu = SoDu + @amount WHERE Id = @userId`);

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar, `Nạp tiền vào ví qua ${bankName}`)
            .input('amount', sql.Int, amount)
            .input('type', sql.NVarChar, 'Nap')
            .input('status', sql.NVarChar, 'ThanhCong')
            .input('refCode', sql.NVarChar, refCode)
            .query(`
                INSERT INTO GiaoDich (MaNguoiDung, TieuDe, SoTien, LoaiGiaoDich, TrangThai, MaThamChieu)
                VALUES (@userId, @title, @amount, @type, @status, @refCode)
            `);

        res.status(200).json({ message: "Nạp tiền thành công!", refCode });
    } catch (err) {
        console.error("Lỗi depositMoney:", err);
        res.status(500).json({ message: "Lỗi nạp tiền", error: err.message });
    }
};

const highlightJob = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.body;
        const fee = 3000000;

        const userRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT SoDu AS Balance, MaCongTy AS CompanyID FROM NguoiDung WHERE Id = @userId`);

        if (userRes.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const { Balance, CompanyID } = userRes.recordset[0];
        if (!CompanyID) {
            return res.status(400).json({ message: "Tài khoản của bạn chưa liên kết với bất kỳ Công ty nào!" });
        }

        if (Balance < fee) {
            return res.status(400).json({ message: "Số dư tài khoản không đủ để thực hiện thanh toán (Cần 3,000,000đ). Vui lòng nạp thêm tiền!" });
        }

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('fee', sql.Int, fee)
            .query(`UPDATE NguoiDung SET SoDu = SoDu - @fee WHERE Id = @userId`);

        await pool.request()
            .input('companyId', sql.Int, CompanyID)
            .query(`
                UPDATE CongTy 
                SET NoiBat = 1 
                WHERE MaCongTy = @companyId;

                UPDATE CongViec 
                SET NoiBat = 1 
                WHERE MaCongTy = @companyId;
            `);

        const refCode = "HDN" + Math.floor(1000000 + Math.random() * 9000000);
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar, `Đăng ký gói VIP doanh nghiệp (Nổi bật Công ty & Tin tuyển dụng trên Trang chủ)`)
            .input('amount', sql.Int, -fee)
            .input('type', sql.NVarChar, 'ThanhToan')
            .input('status', sql.NVarChar, 'ThanhCong')
            .input('refCode', sql.NVarChar, refCode)
            .query(`
                INSERT INTO GiaoDich (MaNguoiDung, TieuDe, SoTien, LoaiGiaoDich, TrangThai, MaThamChieu)
                VALUES (@userId, @title, @amount, @type, @status, @refCode)
            `);

        res.status(200).json({ message: "Kích hoạt Đặc quyền VIP Doanh nghiệp thành công!" });
    } catch (err) {
        console.error("Lỗi highlightCompany:", err);
        res.status(500).json({ message: "Lỗi kích hoạt gói VIP doanh nghiệp", error: err.message });
    }
};

const sellCourse = async (req, res) => {
    try {
        await poolConnect;
        const { userId, courseName, price } = req.body;

        if (!price || price <= 0) {
            return res.status(400).json({ message: "Giá khóa học không hợp lệ" });
        }

        const systemFee = Math.floor(price * 0.15);
        const recruiterRevenue = price - systemFee;

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('revenue', sql.Int, recruiterRevenue)
            .query(`UPDATE NguoiDung SET SoDu = SoDu + @revenue WHERE Id = @userId`);

        const refCode = "CRS" + Math.floor(1000000 + Math.random() * 9000000);
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar, `Doanh thu khóa học "${courseName}" (-15% phí hệ thống)`)
            .input('amount', sql.Int, recruiterRevenue)
            .input('type', sql.NVarChar, 'BanKhoaHoc')
            .input('status', sql.NVarChar, 'ThanhCong')
            .input('refCode', sql.NVarChar, refCode)
            .query(`
                INSERT INTO GiaoDich (MaNguoiDung, TieuDe, SoTien, LoaiGiaoDich, TrangThai, MaThamChieu)
                VALUES (@userId, @title, @amount, @type, @status, @refCode)
            `);

        res.status(200).json({ 
            message: "Đã phân chia doanh thu thành công!", 
            recruiterRevenue, 
            systemFee 
        });
    } catch (err) {
        console.error("Lỗi sellCourse:", err);
        res.status(500).json({ message: "Lỗi phân chia doanh thu khóa học", error: err.message });
    }
};

module.exports = {
    getWalletInfo,
    depositMoney,
    highlightJob,
    sellCourse
};
