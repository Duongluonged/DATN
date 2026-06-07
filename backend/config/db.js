const sql = require("mssql");

const config = {
    server: "localhost",
    database: "VietJob_DATN", // Đã đổi theo tên bạn cung cấp
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    // Chế độ đăng nhập không cần mật khẩu (Windows Authentication)
    driver: "msnodesqlv8",
    connectionString: "Driver={SQL Server Native Client 11.0};Server=localhost;Database=VietJob_DATN;Trusted_Connection=yes;"
};

// Lưu ý: Nếu dùng connectionString, bạn cần cài thêm thư viện: npm install msnodesqlv8
// Nếu không muốn cài thêm, hãy dùng cách dưới đây (sa/123456):

const configWithAuth = {
    user: "sa",
    password: "123", 
    server: "localhost",
    database: "VietJob_DATN",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(configWithAuth);
const poolConnect = pool.connect()
    .then(p => {
        console.log("Kết nối SQL Server thành công!");
        
        // Tự động kiểm tra và khởi tạo bảng báo cáo tin JobReports
        p.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='JobReports' AND xtype='U')
            BEGIN
                CREATE TABLE JobReports (
                    ReportID INT IDENTITY(1,1) PRIMARY KEY,
                    JobID INT NOT NULL FOREIGN KEY REFERENCES Jobs(JobID),
                    UserId INT NULL FOREIGN KEY REFERENCES Users(Id),
                    Reason NVARCHAR(255) NOT NULL,
                    Description NVARCHAR(MAX) NULL,
                    Status NVARCHAR(50) DEFAULT 'Pending',
                    CreatedAt DATETIME DEFAULT GETDATE()
                );
                PRINT 'Created table JobReports successfully!';
            END
        `).catch(err => console.error("❌ Lỗi khởi tạo bảng JobReports:", err));

        // Tự động khởi tạo bảng Notifications nếu chưa có
        p.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Notifications' AND xtype='U')
            BEGIN
                CREATE TABLE Notifications (
                    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
                    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                    Type NVARCHAR(50) NOT NULL DEFAULT 'system',
                    Title NVARCHAR(255) NOT NULL,
                    Content NVARCHAR(MAX) NOT NULL,
                    IsRead BIT NOT NULL DEFAULT 0,
                    CreatedAt DATETIME DEFAULT GETDATE(),
                    RelatedID INT NULL
                );
                PRINT 'Created table Notifications successfully!';
            END
        `).catch(err => console.error('❌ Lỗi khởi tạo bảng Notifications:', err));
        
        // Tự động khởi tạo bảng User_Courses nếu chưa có
        p.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='User_Courses' AND xtype='U')
            BEGIN
                CREATE TABLE User_Courses (
                    UserCourseID INT IDENTITY(1,1) PRIMARY KEY,
                    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                    CourseId NVARCHAR(100) NOT NULL,
                    Status NVARCHAR(50) NOT NULL DEFAULT N'Đang quan tâm',
                    CreatedAt DATETIME DEFAULT GETDATE(),
                    LastModifiedAt DATETIME DEFAULT GETDATE()
                );
                PRINT 'Created table User_Courses successfully!';
            END
        `).catch(err => console.error('❌ Lỗi khởi tạo bảng User_Courses:', err));

        // Tự động kiểm tra và bổ sung cột cho bảng khoa_hoc
        p.request().query(`
            IF EXISTS (SELECT * FROM sysobjects WHERE name='khoa_hoc' AND xtype='U')
            BEGIN
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'Category')
                    ALTER TABLE khoa_hoc ADD Category NVARCHAR(50) DEFAULT 'web';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'Rating')
                    ALTER TABLE khoa_hoc ADD Rating DECIMAL(2,1) DEFAULT 4.8;
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'ReviewsCount')
                    ALTER TABLE khoa_hoc ADD ReviewsCount INT DEFAULT 24;
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'Duration')
                    ALTER TABLE khoa_hoc ADD Duration NVARCHAR(50) DEFAULT N'45 giờ';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'LecturesCount')
                    ALTER TABLE khoa_hoc ADD LecturesCount INT DEFAULT 50;
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'Level')
                    ALTER TABLE khoa_hoc ADD Level NVARCHAR(50) DEFAULT N'Mọi trình độ';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'InstructorName')
                    ALTER TABLE khoa_hoc ADD InstructorName NVARCHAR(100) DEFAULT N'Đỗ Phương Thảo';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'InstructorRole')
                    ALTER TABLE khoa_hoc ADD InstructorRole NVARCHAR(150) DEFAULT N'Đối tác Đào tạo VietJob';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'Price')
                    ALTER TABLE khoa_hoc ADD Price INT DEFAULT 1500000;
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'OldPrice')
                    ALTER TABLE khoa_hoc ADD OldPrice INT DEFAULT 3000000;

                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('khoa_hoc') AND name = 'DriveLink')
                    ALTER TABLE khoa_hoc ADD DriveLink NVARCHAR(500) DEFAULT 'https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course';
            END
        `).catch(err => console.error('❌ Lỗi bổ sung cột bảng khoa_hoc:', err));

        return p;
    })
    .catch(err => console.log("Lỗi kết nối DB:", err));

module.exports = { sql, pool, poolConnect };