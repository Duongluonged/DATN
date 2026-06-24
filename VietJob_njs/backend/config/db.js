const sql = require("mssql");

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

        p.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BaoCaoCongViec' AND xtype='U')
            BEGIN
                CREATE TABLE BaoCaoCongViec (
                    MaBaoCao INT IDENTITY(1,1) PRIMARY KEY,
                    MaCongViec INT NOT NULL FOREIGN KEY REFERENCES CongViec(MaCongViec),
                    MaNguoiDung INT NULL FOREIGN KEY REFERENCES NguoiDung(Id),
                    LyDo NVARCHAR(255) NOT NULL,
                    MoTa NVARCHAR(MAX) NULL,
                    TrangThai NVARCHAR(50) DEFAULT 'Pending',
                    NgayTao DATETIME DEFAULT GETDATE()
                );
                PRINT 'Created table BaoCaoCongViec successfully!';
            END
        `).catch(err => console.error("❌ Lỗi khởi tạo bảng BaoCaoCongViec:", err));

        p.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ThongBao' AND xtype='U')
            BEGIN
                CREATE TABLE ThongBao (
                    MaThongBao INT IDENTITY(1,1) PRIMARY KEY,
                    MaNguoiDung INT NOT NULL FOREIGN KEY REFERENCES NguoiDung(Id),
                    LoaiThongBao NVARCHAR(50) NOT NULL DEFAULT 'system',
                    TieuDe NVARCHAR(255) NOT NULL,
                    NoiDung NVARCHAR(MAX) NOT NULL,
                    DaDoc BIT NOT NULL DEFAULT 0,
                    NgayTao DATETIME DEFAULT GETDATE(),
                    MaLienQuan INT NULL
                );
                PRINT 'Created table ThongBao successfully!';
            END
        `).catch(err => console.error('❌ Lỗi khởi tạo bảng ThongBao:', err));

        p.request().query(`
            IF EXISTS (SELECT * FROM sysobjects WHERE name='KhoaHocNguoiDung' AND xtype='U')
            BEGIN
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DangKiKhoahoc' AND xtype='U')
                BEGIN
                    EXEC sp_rename 'KhoaHocNguoiDung', 'DangKiKhoahoc';
                    PRINT 'Renamed table KhoaHocNguoiDung to DangKiKhoahoc successfully!';
                END
                ELSE
                BEGIN
                    DROP TABLE KhoaHocNguoiDung;
                    PRINT 'Dropped duplicate table KhoaHocNguoiDung successfully!';
                END
            END
            ELSE IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DangKiKhoahoc' AND xtype='U')
            BEGIN
                CREATE TABLE DangKiKhoahoc (
                    MaKhoaHocNguoiDung INT IDENTITY(1,1) PRIMARY KEY,
                    MaNguoiDung INT NOT NULL FOREIGN KEY REFERENCES NguoiDung(Id),
                    MaKhoaHoc NVARCHAR(100) NOT NULL,
                    TrangThai NVARCHAR(50) NOT NULL DEFAULT N'Đang quan tâm',
                    NgayTao DATETIME DEFAULT GETDATE(),
                    CapNhatLanCuoi DATETIME DEFAULT GETDATE()
                );
                PRINT 'Created table DangKiKhoahoc successfully!';
            END
        `).catch(err => console.error('❌ Lỗi khởi tạo bảng DangKiKhoahoc:', err));

        p.request().query(`
            IF EXISTS (SELECT * FROM sysobjects WHERE name='KhoaHoc' AND xtype='U')
            BEGIN
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'DanhMuc')
                    ALTER TABLE KhoaHoc ADD DanhMuc NVARCHAR(50) DEFAULT 'web';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'DanhGia')
                    ALTER TABLE KhoaHoc ADD DanhGia DECIMAL(2,1) DEFAULT 4.8;
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'SoLuongDanhGia')
                    ALTER TABLE KhoaHoc ADD SoLuongDanhGia INT DEFAULT 24;
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'ThoiLuong')
                    ALTER TABLE KhoaHoc ADD ThoiLuong NVARCHAR(50) DEFAULT N'45 giờ';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'SoBaiHoc')
                    ALTER TABLE KhoaHoc ADD SoBaiHoc INT DEFAULT 50;
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'TrinhDo')
                    ALTER TABLE KhoaHoc ADD TrinhDo NVARCHAR(50) DEFAULT N'Mọi trình độ';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'TenGiangVien')
                    ALTER TABLE KhoaHoc ADD TenGiangVien NVARCHAR(100) DEFAULT N'Đỗ Phương Thảo';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'VaiTroGiangVien')
                    ALTER TABLE KhoaHoc ADD VaiTroGiangVien NVARCHAR(150) DEFAULT N'Đối tác Đào tạo VietJob';
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'Gia')
                    ALTER TABLE KhoaHoc ADD Gia INT DEFAULT 1500000;
                    
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'GiaCu')
                    ALTER TABLE KhoaHoc ADD GiaCu INT DEFAULT 3000000;
 
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('KhoaHoc') AND name = 'DuongDanDrive')
                    ALTER TABLE KhoaHoc ADD DuongDanDrive NVARCHAR(500) DEFAULT 'https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course';
            END
        `).catch(err => console.error('❌ Lỗi bổ sung cột bảng KhoaHoc:', err));

        return p;
    })
    .catch(err => console.log("Lỗi kết nối DB:", err));

module.exports = { sql, pool, poolConnect };