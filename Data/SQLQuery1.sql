-- 1. Bảng Danh mục
CREATE TABLE danh_muc (
    id INT PRIMARY KEY IDENTITY(1,1),
    ten NVARCHAR(255) NOT NULL
);

-- 2. Bảng Địa điểm
CREATE TABLE dia_diem (
    id INT PRIMARY KEY IDENTITY(1,1),
    ten NVARCHAR(255) NOT NULL
);

-- 3. Bảng Người dùng (Bảng gốc cho Ung vien và Nha tuyen dung)
CREATE TABLE nguoi_dung (
    id INT PRIMARY KEY IDENTITY(1,1),
    email VARCHAR(255) UNIQUE NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    vai_tro NVARCHAR(50),
    trang_thai NVARCHAR(50),
    ngay_tao DATETIME DEFAULT GETDATE()
);

-- 4. Bảng Nhà tuyển dụng
CREATE TABLE nha_tuyen_dung (
    id INT PRIMARY KEY IDENTITY(1,1),
    nguoi_dung_id INT FOREIGN KEY REFERENCES nguoi_dung(id),
    ten_cong_ty NVARCHAR(255),
    logo VARCHAR(255),
    mo_ta NVARCHAR(MAX),
    website VARCHAR(255),
    dia_chi NVARCHAR(MAX)
);

-- 5. Bảng Ứng viên
CREATE TABLE ung_vien (
    id INT PRIMARY KEY IDENTITY(1,1),
    nguoi_dung_id INT FOREIGN KEY REFERENCES nguoi_dung(id),
    ho_ten NVARCHAR(255),
    so_dien_thoai VARCHAR(20),
    dia_chi NVARCHAR(MAX),
    avatar VARCHAR(255),
    so_nam_kinh_nghiem INT
);

-- 6. Bảng Tin tuyển dụng
CREATE TABLE tin_tuyen_dung (
    id INT PRIMARY KEY IDENTITY(1,1),
    nha_tuyen_dung_id INT FOREIGN KEY REFERENCES nha_tuyen_dung(id),
    tieu_de NVARCHAR(255),
    mo_ta NVARCHAR(MAX),
    yeu_cau NVARCHAR(MAX),
    luong_min INT,
    luong_max INT,
    danh_muc_id INT FOREIGN KEY REFERENCES danh_muc(id),
    dia_diem_id INT FOREIGN KEY REFERENCES dia_diem(id),
    trang_thai NVARCHAR(50),
    ngay_tao DATETIME DEFAULT GETDATE()
);

-- 7. Bảng CV
CREATE TABLE cv (
    id INT PRIMARY KEY IDENTITY(1,1),
    ung_vien_id INT FOREIGN KEY REFERENCES ung_vien(id),
    tieu_de NVARCHAR(255),
    duong_dan_file VARCHAR(255),
    ngay_tao DATETIME DEFAULT GETDATE()
);

-- 8. Bảng Hồ sơ ứng tuyển
CREATE TABLE ho_so_ung_tuyen (
    id INT PRIMARY KEY IDENTITY(1,1),
    ung_vien_id INT FOREIGN KEY REFERENCES ung_vien(id),
    tin_tuyen_dung_id INT FOREIGN KEY REFERENCES tin_tuyen_dung(id),
    cv_id INT FOREIGN KEY REFERENCES cv(id),
    trang_thai NVARCHAR(50),
    ngay_ung_tuyen DATETIME DEFAULT GETDATE()
);

-- 9. Bảng Đánh giá
CREATE TABLE danh_gia (
    id INT PRIMARY KEY IDENTITY(1,1),
    ung_vien_id INT FOREIGN KEY REFERENCES ung_vien(id),
    nha_tuyen_dung_id INT FOREIGN KEY REFERENCES nha_tuyen_dung(id),
    diem INT CHECK (diem >= 1 AND diem <= 5),
    binh_luan NVARCHAR(MAX),
    ngay_tao DATETIME DEFAULT GETDATE()
);

-- 10. Bảng Việc đã lưu
CREATE TABLE viec_da_luu (
    id INT PRIMARY KEY IDENTITY(1,1),
    ung_vien_id INT FOREIGN KEY REFERENCES ung_vien(id),
    tin_tuyen_dung_id INT FOREIGN KEY REFERENCES tin_tuyen_dung(id)
);

-- 11. Bảng Thông báo
CREATE TABLE thong_bao (
    id INT PRIMARY KEY IDENTITY(1,1),
    nguoi_dung_id INT FOREIGN KEY REFERENCES nguoi_dung(id),
    noi_dung NVARCHAR(MAX),
    da_doc BIT DEFAULT 0,
    ngay_tao DATETIME DEFAULT GETDATE()
);

-- 12. Bảng Ví tiền
CREATE TABLE vi_tien (
    id INT PRIMARY KEY IDENTITY(1,1),
    nha_tuyen_dung_id INT FOREIGN KEY REFERENCES nha_tuyen_dung(id),
    so_du DECIMAL(18, 2) DEFAULT 0
);

-- 13. Bảng Giao dịch
CREATE TABLE giao_dich (
    id INT PRIMARY KEY IDENTITY(1,1),
    vi_tien_id INT FOREIGN KEY REFERENCES vi_tien(id),
    so_tien DECIMAL(18, 2),
    loai NVARCHAR(50),
    ngay_tao DATETIME DEFAULT GETDATE()
);