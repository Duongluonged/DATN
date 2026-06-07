const { pool, poolConnect, sql } = require('../config/db');

// Tự động kiểm tra và khởi tạo database cho Ví tiền
const initializeWalletDB = async () => {
    try {
        await poolConnect;
        
        // 1. Thêm cột Balance vào bảng Users nếu chưa có
        await pool.request().query(`
            IF NOT EXISTS (
                SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Balance'
            )
            BEGIN
                ALTER TABLE Users ADD Balance INT NOT NULL DEFAULT 5000000; -- Tặng sẵn 5M VND làm vốn trải nghiệm
            END
        `);

        // 2. Thêm cột IsHighlighted vào bảng Jobs nếu chưa có
        await pool.request().query(`
            IF NOT EXISTS (
                SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Jobs' AND COLUMN_NAME = 'IsHighlighted'
            )
            BEGIN
                ALTER TABLE Jobs ADD IsHighlighted BIT NOT NULL DEFAULT 0;
            END
        `);

        // 3. Tạo bảng Transactions lưu lịch sử giao dịch nếu chưa có
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Transactions')
            BEGIN
                CREATE TABLE Transactions (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    UserId INT NOT NULL,
                    Title NVARCHAR(255) NOT NULL,
                    Amount INT NOT NULL,
                    Type NVARCHAR(50) NOT NULL, -- 'Nap', 'ThanhToan', 'BanKhoaHoc'
                    Status NVARCHAR(50) NOT NULL, -- 'ThanhCong', 'ThatBai'
                    CreatedAt DATETIME DEFAULT GETDATE(),
                    RefCode NVARCHAR(100)
                );
            END
        `);

        // 4. Đảm bảo cột IsHot của bảng Companies có giá trị mặc định là 0 và cập nhật NULL thành 0
        await pool.request().query(`
            IF NOT EXISTS (
                SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'IsHot'
            )
            BEGIN
                ALTER TABLE Companies ADD IsHot INT NOT NULL DEFAULT 0;
            END
            ELSE
            BEGIN
                EXEC('UPDATE Companies SET IsHot = 0 WHERE IsHot IS NULL');
            END
        `);

        console.log("✅ Wallet database initialized successfully!");
    } catch (err) {
        console.error("❌ Error initializing wallet DB:", err);
    }
};

// Gọi chạy khởi tạo khi import
initializeWalletDB();

// 1. Lấy thông tin ví & Lịch sử giao dịch
const getWalletInfo = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;

        // Lấy số dư tài khoản
        const userRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT Balance FROM Users WHERE Id = @userId`);
        
        if (userRes.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const balance = userRes.recordset[0].Balance;

        // Lấy lịch sử giao dịch
        const transactionsRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT TOP 20 * FROM Transactions 
                WHERE UserId = @userId 
                ORDER BY CreatedAt DESC
            `);

        // Lấy danh sách tin tuyển dụng của nhà tuyển dụng này (để làm nổi bật)
        const jobsRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT J.JobID, J.JobTitle, J.IsHighlighted, J.IsActive
                FROM Jobs J
                JOIN Users U ON J.CompanyID = U.CompanyID
                WHERE U.Id = @userId AND J.IsActive = 1
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

// 2. Nạp tiền vào ví
const depositMoney = async (req, res) => {
    try {
        await poolConnect;
        const { userId, amount, bankName } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Số tiền nạp không hợp lệ" });
        }

        const refCode = "NAP" + Math.floor(1000000 + Math.random() * 9000000);

        // Cộng số dư vào bảng Users
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('amount', sql.Int, amount)
            .query(`UPDATE Users SET Balance = Balance + @amount WHERE Id = @userId`);

        // Ghi nhận lịch sử giao dịch
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar, `Nạp tiền vào ví qua ${bankName}`)
            .input('amount', sql.Int, amount)
            .input('type', sql.NVarChar, 'Nap')
            .input('status', sql.NVarChar, 'ThanhCong')
            .input('refCode', sql.NVarChar, refCode)
            .query(`
                INSERT INTO Transactions (UserId, Title, Amount, Type, Status, RefCode)
                VALUES (@userId, @title, @amount, @type, @status, @refCode)
            `);

        res.status(200).json({ message: "Nạp tiền thành công!", refCode });
    } catch (err) {
        console.error("Lỗi depositMoney:", err);
        res.status(500).json({ message: "Lỗi nạp tiền", error: err.message });
    }
};

// 3. Kích hoạt gói đặc quyền VIP Doanh nghiệp (Nổi bật Công ty & các Tin tuyển dụng)
const highlightJob = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.body;
        const fee = 3000000; // Phí kích hoạt VIP Doanh nghiệp: 3,000,000 VND

        // 1. Kiểm tra số dư & CompanyID của người dùng
        const userRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT Balance, CompanyID FROM Users WHERE Id = @userId`);

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

        // 2. Trừ tiền
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('fee', sql.Int, fee)
            .query(`UPDATE Users SET Balance = Balance - @fee WHERE Id = @userId`);

        // 3. Đánh dấu CÔNG TY (IsHot = 1) & Tất cả tin tuyển dụng của công ty (IsHighlighted = 1) là nổi bật VIP
        await pool.request()
            .input('companyId', sql.Int, CompanyID)
            .query(`
                UPDATE Companies 
                SET IsHot = 1 
                WHERE CompanyID = @companyId;

                UPDATE Jobs 
                SET IsHighlighted = 1 
                WHERE CompanyID = @companyId;
            `);

        // 4. Ghi nhận giao dịch
        const refCode = "HDN" + Math.floor(1000000 + Math.random() * 9000000);
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar, `Đăng ký gói VIP doanh nghiệp (Nổi bật Công ty & Tin tuyển dụng trên Trang chủ)`)
            .input('amount', sql.Int, -fee)
            .input('type', sql.NVarChar, 'ThanhToan')
            .input('status', sql.NVarChar, 'ThanhCong')
            .input('refCode', sql.NVarChar, refCode)
            .query(`
                INSERT INTO Transactions (UserId, Title, Amount, Type, Status, RefCode)
                VALUES (@userId, @title, @amount, @type, @status, @refCode)
            `);

        res.status(200).json({ message: "Kích hoạt Đặc quyền VIP Doanh nghiệp thành công!" });
    } catch (err) {
        console.error("Lỗi highlightCompany:", err);
        res.status(500).json({ message: "Lỗi kích hoạt gói VIP doanh nghiệp", error: err.message });
    }
};

// 4. Chia sẻ % doanh thu khi bán khóa học (Recruiter bán khóa học, hệ thống nhận 15% hoa hồng)
const sellCourse = async (req, res) => {
    try {
        await poolConnect;
        const { userId, courseName, price } = req.body;

        if (!price || price <= 0) {
            return res.status(400).json({ message: "Giá khóa học không hợp lệ" });
        }

        // Tỷ lệ chia sẻ: Hệ thống lấy 15%, Nhà tuyển dụng nhận 85%
        const systemFee = Math.floor(price * 0.15);
        const recruiterRevenue = price - systemFee;

        // Cộng 85% doanh thu vào ví nhà tuyển dụng
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('revenue', sql.Int, recruiterRevenue)
            .query(`UPDATE Users SET Balance = Balance + @revenue WHERE Id = @userId`);

        // Ghi nhận giao dịch của nhà tuyển dụng
        const refCode = "CRS" + Math.floor(1000000 + Math.random() * 9000000);
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar, `Doanh thu khóa học "${courseName}" (-15% phí hệ thống)`)
            .input('amount', sql.Int, recruiterRevenue)
            .input('type', sql.NVarChar, 'BanKhoaHoc')
            .input('status', sql.NVarChar, 'ThanhCong')
            .input('refCode', sql.NVarChar, refCode)
            .query(`
                INSERT INTO Transactions (UserId, Title, Amount, Type, Status, RefCode)
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
