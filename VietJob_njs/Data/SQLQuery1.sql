USE [VietJob_DATN]
GO
/****** Object:  Table [dbo].[NguoiDungBoilerplate]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NguoiDungBoilerplate](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[SoLanDangNhapSai] [int] NOT NULL,
	[NguonXacThuc] [nvarchar](64) NULL,
	[NhanDongThoi] [nvarchar](128) NULL,
	[ThoiGianTao] [datetime2](7) NOT NULL,
	[MaNguoiTao] [bigint] NULL,
	[MaNguoiXoa] [bigint] NULL,
	[ThoiGianXoa] [datetime2](7) NULL,
	[DiaChiEmail] [nvarchar](256) NOT NULL,
	[MaXacNhanEmail] [nvarchar](328) NULL,
	[TrangThaiHoatDong] [bit] NOT NULL,
	[DaXoa] [bit] NOT NULL,
	[DaXacNhanEmail] [bit] NOT NULL,
	[KichHoatKhoaKhoa] [bit] NOT NULL,
	[DaXacNhanSoDienThoai] [bit] NOT NULL,
	[XacThucHaiLop] [bit] NOT NULL,
	[ThoiGianCapNhatCuoi] [datetime2](7) NULL,
	[MaNguoiCapNhatCuoi] [bigint] NULL,
	[NgayKetThucKhoaUtc] [datetime2](7) NULL,
	[Ten] [nvarchar](64) NOT NULL,
	[EmailChuanHoa] [nvarchar](256) NOT NULL,
	[TenDangNhapChuanHoa] [nvarchar](256) NOT NULL,
	[MatKhau] [nvarchar](128) NOT NULL,
	[MaResetMatKhau] [nvarchar](328) NULL,
	[SoDienThoai] [nvarchar](32) NULL,
	[NhanBaoMat] [nvarchar](128) NULL,
	[Ho] [nvarchar](64) NOT NULL,
	[MaChiNhanh] [int] NULL,
	[TenDangNhap] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_NguoiDungBoilerplate] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HoSoUngVien]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HoSoUngVien](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[MaNguoiDung] [bigint] NOT NULL,
	[HoTen] [nvarchar](256) NOT NULL,
	[TieuDe] [nvarchar](max) NULL,
	[KyNang] [nvarchar](max) NULL,
	[HocVan] [nvarchar](max) NULL,
	[KinhNghiem] [nvarchar](max) NULL,
	[DuongDanCv] [nvarchar](max) NULL,
	[SoDienThoai] [nvarchar](max) NULL,
	[ThoiGianTao] [datetime2](7) NOT NULL,
	[MaNguoiTao] [bigint] NULL,
	[ThoiGianCapNhatCuoi] [datetime2](7) NULL,
	[MaNguoiCapNhatCuoi] [bigint] NULL,
	[DaXoa] [bit] NOT NULL,
	[MaNguoiXoa] [bigint] NULL,
	[ThoiGianXoa] [datetime2](7) NULL,
 CONSTRAINT [PK_HoSoUngVien] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DonUngTuyen]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DonUngTuyen](
	[MaDonUngTuyen] [int] IDENTITY(1,1) NOT NULL,
	[MaCongViec] [int] NOT NULL,
	[TenUngVien] [nvarchar](255) NOT NULL,
	[SoDienThoai] [nvarchar](20) NULL,
	[ThanhPho] [nvarchar](100) NULL,
	[ThuGioiThieu] [nvarchar](max) NULL,
	[DuongDanCv] [nvarchar](max) NULL,
	[NgayNop] [datetime] NULL,
	[TrangThai] [nvarchar](50) NULL,
	[MaNguoiDung] [int] NULL,
	[NgayPhongVan] [nvarchar](100) NULL,
	[HinhThucPhongVan] [nvarchar](100) NULL,
	[DiaDiemPhongVan] [nvarchar](500) NULL,
	[GhiChuPhongVan] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[MaDonUngTuyen] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CvUngVien]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CvUngVien](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MaNguoiDung] [int] NOT NULL,
	[GioiThieu] [nvarchar](max) NULL,
	[KyNang] [nvarchar](max) NULL,
	[NgayTao] [datetime] NULL,
	[DuongDanFileCv] [nvarchar](2000) NULL,
	[TenFileCv] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FileUngVien]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FileUngVien](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MaNguoiDung] [int] NOT NULL,
	[TenFile] [nvarchar](500) NOT NULL,
	[DuongDanFile] [nvarchar](2000) NOT NULL,
	[KichThuocFile] [int] NULL,
	[NgayTaiLen] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CongTy]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CongTy](
	[MaCongTy] [int] IDENTITY(1,1) NOT NULL,
	[TenCongTy] [nvarchar](255) NOT NULL,
	[DuongDanLogo] [nvarchar](500) NULL,
	[MoTa] [nvarchar](max) NULL,
	[DuongDanWebsite] [nvarchar](255) NULL,
	[DiaDiem] [nvarchar](100) NULL,
	[NoiBat] [bit] NULL,
	[NgayTao] [datetime] NULL,
	[NganhNghe] [nvarchar](255) NULL,
	[QuyMo] [nvarchar](100) NULL,
	[QuocGia] [nvarchar](100) NULL,
	[ThoiGianLamViec] [nvarchar](255) NULL,
	[LuongTrungBinh] [nvarchar](100) NULL,
	[DanhGia] [decimal](2, 1) NULL,
	[SoLuongDanhGia] [int] NULL,
	[MoTaChiTiet] [nvarchar](max) NULL,
	[DuongDayNong] [varchar](20) NULL,
	[AnhVanPhong] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[MaCongTy] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DanhGiaCongTy]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DanhGiaCongTy](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MaCongTy] [int] NOT NULL,
	[MaNguoiDung] [int] NULL,
	[DanhGia] [int] NOT NULL,
	[TomTat] [nvarchar](500) NOT NULL,
	[ChinhSachTangCa] [nvarchar](50) NULL,
	[LyDoTangCa] [nvarchar](1000) NULL,
	[DiemYeuThich] [nvarchar](max) NULL,
	[GopY] [nvarchar](max) NULL,
	[NgayTao] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HocVanCv]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HocVanCv](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MaCv] [int] NOT NULL,
	[TenTruong] [nvarchar](255) NOT NULL,
	[ChuyenNganh] [nvarchar](255) NOT NULL,
	[NgayBatDau] [date] NULL,
	[NgayKetThuc] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KinhNghiemCv]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KinhNghiemCv](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MaCv] [int] NOT NULL,
	[TenCongTy] [nvarchar](255) NOT NULL,
	[ViTri] [nvarchar](100) NOT NULL,
	[NgayBatDau] [date] NULL,
	[NgayKetThuc] [date] NULL,
	[MoTa] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BaoCaoCongViec]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BaoCaoCongViec](
	[MaBaoCao] [int] IDENTITY(1,1) NOT NULL,
	[MaCongViec] [int] NOT NULL,
	[MaNguoiDung] [int] NULL,
	[LyDo] [nvarchar](255) NOT NULL,
	[MoTa] [nvarchar](max) NULL,
	[TrangThai] [nvarchar](50) NULL,
	[NgayTao] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[MaBaoCao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CongViec]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CongViec](
	[MaCongViec] [int] IDENTITY(1,1) NOT NULL,
	[MaCongTy] [int] NULL,
	[TieuDeCongViec] [nvarchar](255) NOT NULL,
	[MucLuong] [nvarchar](100) NULL,
	[LoaiCongViec] [nvarchar](50) NULL,
	[KinhNghiem] [nvarchar](100) NULL,
	[DiaDiem] [nvarchar](255) NULL,
	[MoTa] [nvarchar](max) NULL,
	[TrangThaiHoatDong] [bit] NULL,
	[NgayTao] [datetime] NULL,
	[KyNang] [nvarchar](max) NULL,
	[CapBac] [nvarchar](100) NULL,
	[GioiTinh] [nvarchar](50) NULL,
	[HanNopHoSo] [datetime] NULL,
	[YeuCau] [nvarchar](max) NULL,
	[QuyenLoi] [nvarchar](max) NULL,
	[NoiBat] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MaCongViec] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KyNangCongViec]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KyNangCongViec](
	[MaCongViec] [int] NOT NULL,
	[MaKyNang] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MaCongViec] ASC,
	[MaKyNang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KhoaHoc]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KhoaHoc](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MaNhaTuyenDung] [int] NOT NULL,
	[TieuDe] [nvarchar](max) NULL,
	[MoTa] [nvarchar](max) NULL,
	[TrangThai] [nvarchar](max) NULL,
	[ThoiGianTao] [datetime2](7) NOT NULL,
	[MaNguoiTao] [bigint] NULL,
	[ThoiGianCapNhat] [datetime2](7) NULL,
	[MaNguoiCapNhat] [bigint] NULL,
	[DaXoa] [bit] NOT NULL,
	[MaNguoiXoa] [bigint] NULL,
	[ThoiGianXoa] [datetime2](7) NULL,
	[DanhMuc] [nvarchar](50) NULL,
	[DanhGia] [decimal](2, 1) NULL,
	[SoLuongDanhGia] [int] NULL,
	[ThoiLuong] [nvarchar](50) NULL,
	[SoBaiHoc] [int] NULL,
	[TrinhDo] [nvarchar](50) NULL,
	[TenGiangVien] [nvarchar](100) NULL,
	[VaiTroGiangVien] [nvarchar](150) NULL,
	[Gia] [int] NULL,
	[GiaCu] [int] NULL,
	[DuongDanDrive] [nvarchar](500) NULL,
 CONSTRAINT [PK_KhoaHoc] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TinNhan]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TinNhan](
	[MaTinNhan] [int] IDENTITY(1,1) NOT NULL,
	[MaNguoiGui] [int] NOT NULL,
	[MaNguoiNhan] [int] NOT NULL,
	[NoiDungTinNhan] [nvarchar](max) NOT NULL,
	[NgayTao] [datetime] NULL,
	[DaDoc] [bit] NULL,
	[DuongDanDinhKem] [nvarchar](max) NULL,
	[TenFileDinhKem] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[MaTinNhan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ThongBao]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ThongBao](
	[MaThongBao] [int] IDENTITY(1,1) NOT NULL,
	[MaNguoiDung] [int] NOT NULL,
	[LoaiThongBao] [nvarchar](50) NOT NULL,
	[TieuDe] [nvarchar](255) NOT NULL,
	[NoiDung] [nvarchar](max) NOT NULL,
	[DaDoc] [bit] NOT NULL,
	[NgayTao] [datetime] NULL,
	[MaLienQuan] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[MaThongBao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TuKhoaPhoBien]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TuKhoaPhoBien](
	[MaTuKhoa] [int] IDENTITY(1,1) NOT NULL,
	[TenTuKhoa] [nvarchar](100) NOT NULL,
	[SoLuotTimKiem] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[MaTuKhoa] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VaiTro]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VaiTro](
	[MaVaiTro] [int] IDENTITY(1,1) NOT NULL,
	[TenVaiTro] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MaVaiTro] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KyNang]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KyNang](
	[MaKyNang] [int] IDENTITY(1,1) NOT NULL,
	[TenKyNang] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MaKyNang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GiaoDich]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GiaoDich](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MaNguoiDung] [int] NOT NULL,
	[TieuDe] [nvarchar](255) NOT NULL,
	[SoTien] [int] NOT NULL,
	[LoaiGiaoDich] [nvarchar](50) NOT NULL,
	[TrangThai] [nvarchar](50) NOT NULL,
	[NgayTao] [datetime] NULL,
	[MaThamChieu] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DangKiKhoahoc]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DangKiKhoahoc](
	[MaKhoaHocNguoiDung] [int] IDENTITY(1,1) NOT NULL,
	[MaNguoiDung] [int] NOT NULL,
	[MaKhoaHoc] [nvarchar](100) NOT NULL,
	[TrangThai] [nvarchar](50) NOT NULL,
	[NgayTao] [datetime] NULL,
	[CapNhatLanCuoi] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[MaKhoaHocNguoiDung] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VaiTroNguoiDung]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VaiTroNguoiDung](
	[MaNguoiDung] [int] NOT NULL,
	[MaVaiTro] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MaNguoiDung] ASC,
	[MaVaiTro] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NguoiDung]    Script Date: 6/7/2026 10:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NguoiDung](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TenDangNhap] [nvarchar](100) NOT NULL,
	[MatKhau] [nvarchar](max) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[NgayTao] [datetime] NULL,
	[TrangThai] [nvarchar](20) NULL,
	[SoDienThoai] [varchar](20) NULL,
	[DiaChi] [nvarchar](250) NULL,
	[MaCongTy] [int] NULL,
	[SoDu] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[NguoiDungBoilerplate] ON 

INSERT [dbo].[NguoiDungBoilerplate] ([Id], [SoLanDangNhapSai], [NguonXacThuc], [NhanDongThoi], [ThoiGianTao], [MaNguoiTao], [MaNguoiXoa], [ThoiGianXoa], [DiaChiEmail], [MaXacNhanEmail], [TrangThaiHoatDong], [DaXoa], [DaXacNhanEmail], [KichHoatKhoaKhoa], [DaXacNhanSoDienThoai], [XacThucHaiLop], [ThoiGianCapNhatCuoi], [MaNguoiCapNhatCuoi], [NgayKetThucKhoaUtc], [Ten], [EmailChuanHoa], [TenDangNhapChuanHoa], [MatKhau], [MaResetMatKhau], [SoDienThoai], [NhanBaoMat], [Ho], [MaChiNhanh], [TenDangNhap]) VALUES (3, 0, NULL, N'965e8f71-8abc-44a6-9a24-0eb28322b26d', CAST(N'2026-04-07T10:52:01.4952130' AS DateTime2), NULL, NULL, NULL, N'luongduong@gmail.com', NULL, 1, 0, 1, 1, 0, 0, CAST(N'2026-04-18T09:42:16.4005540' AS DateTime2), NULL, CAST(N'2026-04-18T02:47:16.3893572' AS DateTime2), N'Duong', N'LUONGDUONG@GMAIL.COM', N'DUONGSU', N'AQAAAAIAAYagAAAAEBdbKkbqNRCKfJgV2H7135WRBIRopZ6D8/pXvBqB6S0R6u/V6tU+BwS6vY/z/g==', NULL, NULL, N'RD5SXDDIVY7L4PRD4E5PTYGWG2QHFZAH', N'Luong', 1, N'DuongSu')
INSERT [dbo].[NguoiDungBoilerplate] ([Id], [SoLanDangNhapSai], [NguonXacThuc], [NhanDongThoi], [ThoiGianTao], [MaNguoiTao], [MaNguoiXoa], [ThoiGianXoa], [DiaChiEmail], [MaXacNhanEmail], [TrangThaiHoatDong], [DaXoa], [DaXacNhanEmail], [KichHoatKhoaKhoa], [DaXacNhanSoDienThoai], [XacThucHaiLop], [ThoiGianCapNhatCuoi], [MaNguoiCapNhatCuoi], [NgayKetThucKhoaUtc], [Ten], [EmailChuanHoa], [TenDangNhapChuanHoa], [MatKhau], [MaResetMatKhau], [SoDienThoai], [NhanBaoMat], [Ho], [MaChiNhanh], [TenDangNhap]) VALUES (4, 0, NULL, N'319a69ea-0026-4732-8596-1f2ddf23c556', CAST(N'2026-04-07T16:24:10.5225509' AS DateTime2), NULL, NULL, NULL, N'luongduongess@gmail.com', NULL, 1, 0, 1, 1, 0, 0, CAST(N'2026-04-18T10:25:29.7792065' AS DateTime2), NULL, CAST(N'2026-04-18T03:30:29.7743932' AS DateTime2), N'Duong', N'LUONGDUONGESS@GMAIL.COM', N'DUONGLUONG', N'AQAAAAIAAYagAAAAEPxaVKzetXax1bBgCljoBZAqleIU0uiFBOw3c2bt9HnyZPruyhyPgwDradlK9IUCOQ==', NULL, NULL, N'UZ52HGJNB2YPJANYPC2WP65K5CBDXYIJ', N'Luong', 1, N'DuongLuong')
INSERT [dbo].[NguoiDungBoilerplate] ([Id], [SoLanDangNhapSai], [NguonXacThuc], [NhanDongThoi], [ThoiGianTao], [MaNguoiTao], [MaNguoiXoa], [ThoiGianXoa], [DiaChiEmail], [MaXacNhanEmail], [TrangThaiHoatDong], [DaXoa], [DaXacNhanEmail], [KichHoatKhoaKhoa], [DaXacNhanSoDienThoai], [XacThucHaiLop], [ThoiGianCapNhatCuoi], [MaNguoiCapNhatCuoi], [NgayKetThucKhoaUtc], [Ten], [EmailChuanHoa], [TenDangNhapChuanHoa], [MatKhau], [MaResetMatKhau], [SoDienThoai], [NhanBaoMat], [Ho], [MaChiNhanh], [TenDangNhap]) VALUES (5, 0, NULL, N'd6e58084-0d7b-448b-a43c-8093f95118a3', CAST(N'2026-04-09T10:02:43.9602587' AS DateTime2), NULL, NULL, NULL, N'admin@aspnetboilerplate.com', NULL, 1, 0, 1, 0, 0, 0, NULL, NULL, NULL, N'admin', N'ADMIN@ASPNETBOILERPLATE.COM', N'ADMIN', N'AQAAAAIAAYagAAAAEHUsEdKjFi8BpjsYkV96QfSqGuLTlZFWyvO+1OalnNyYA+VId+8p5jf8vniungFaWw==', NULL, NULL, N'd668d6cb-1c5c-97d9-29f1-3a20825e03f8', N'admin', NULL, N'admin')
INSERT [dbo].[NguoiDungBoilerplate] ([Id], [SoLanDangNhapSai], [NguonXacThuc], [NhanDongThoi], [ThoiGianTao], [MaNguoiTao], [MaNguoiXoa], [ThoiGianXoa], [DiaChiEmail], [MaXacNhanEmail], [TrangThaiHoatDong], [DaXoa], [DaXacNhanEmail], [KichHoatKhoaKhoa], [DaXacNhanSoDienThoai], [XacThucHaiLop], [ThoiGianCapNhatCuoi], [MaNguoiCapNhatCuoi], [NgayKetThucKhoaUtc], [Ten], [EmailChuanHoa], [TenDangNhapChuanHoa], [MatKhau], [MaResetMatKhau], [SoDienThoai], [NhanBaoMat], [Ho], [MaChiNhanh], [TenDangNhap]) VALUES (6, 0, NULL, N'cd24e927-b4f5-445a-97d7-32d6342f139a', CAST(N'2026-04-09T10:02:44.3896415' AS DateTime2), NULL, NULL, NULL, N'admin@defaulttenant.com', NULL, 1, 0, 1, 0, 0, 0, CAST(N'2026-04-18T09:43:36.2666515' AS DateTime2), NULL, NULL, N'admin', N'ADMIN@DEFAULTTENANT.COM', N'ADMIN', N'AQAAAAIAAYagAAAAEG/oQhCuv/3R/1zLqzgDEI7JNPvIz5KM5e3PZraaiZKbaZFj6DC27QwjQ4cosMUUww==', NULL, NULL, N'cc8bcbd8-a1ca-8797-da5e-3a20825e05a5', N'admin', 1, N'admin')
INSERT [dbo].[NguoiDungBoilerplate] ([Id], [SoLanDangNhapSai], [NguonXacThuc], [NhanDongThoi], [ThoiGianTao], [MaNguoiTao], [MaNguoiXoa], [ThoiGianXoa], [DiaChiEmail], [MaXacNhanEmail], [TrangThaiHoatDong], [DaXoa], [DaXacNhanEmail], [KichHoatKhoaKhoa], [DaXacNhanSoDienThoai], [XacThucHaiLop], [ThoiGianCapNhatCuoi], [MaNguoiCapNhatCuoi], [NgayKetThucKhoaUtc], [Ten], [EmailChuanHoa], [TenDangNhapChuanHoa], [MatKhau], [MaResetMatKhau], [SoDienThoai], [NhanBaoMat], [Ho], [MaChiNhanh], [TenDangNhap]) VALUES (7, 0, NULL, N'99c70ccc-3c38-4902-ab24-611f401f89fe', CAST(N'2026-04-18T10:31:12.4342228' AS DateTime2), NULL, NULL, NULL, N'daiduong@gmail.com', NULL, 1, 0, 1, 1, 0, 0, NULL, NULL, NULL, N'Duong', N'DAIDUONG@GMAIL.COM', N'DAIDUONG', N'AQAAAAIAAYagAAAAEOP+ZC1l9eSxRP3+UZutuxAP4QkKXmHs0gUZRDfrVyb5XjmHxNOHUSA+qWHk3KP0BA==', NULL, NULL, N'JY7CGP3V4B4DHRNTSTWXZHYXN2EFR2B3', N'Dai', 1, N'DaiDuong')
SET IDENTITY_INSERT [dbo].[NguoiDungBoilerplate] OFF
GO
SET IDENTITY_INSERT [dbo].[HoSoUngVien] ON 

INSERT [dbo].[HoSoUngVien] ([Id], [MaNguoiDung], [HoTen], [TieuDe], [KyNang], [HocVan], [KinhNghiem], [DuongDanCv], [SoDienThoai], [ThoiGianTao], [MaNguoiTao], [ThoiGianCapNhatCuoi], [MaNguoiCapNhatCuoi], [DaXoa], [MaNguoiXoa], [ThoiGianXoa]) VALUES (1, 4, N'LuongDaiDuong', N'UT 3D', N'Blen', N'Univers', N'2 years', N'http://Duong', N'0989460482', CAST(N'2026-04-07T16:37:32.9393985' AS DateTime2), 4, NULL, NULL, 1, 4, CAST(N'2026-04-07T16:46:37.3512689' AS DateTime2))
INSERT [dbo].[HoSoUngVien] ([Id], [MaNguoiDung], [HoTen], [TieuDe], [KyNang], [HocVan], [KinhNghiem], [DuongDanCv], [SoDienThoai], [ThoiGianTao], [MaNguoiTao], [ThoiGianCapNhatCuoi], [MaNguoiCapNhatCuoi], [DaXoa], [MaNguoiXoa], [ThoiGianXoa]) VALUES (2, 3, N'DoThao', N'Intern', N'Luat', N'Univer', N'3 years', N'http://Thao', N'0386283669', CAST(N'2026-04-07T16:41:00.8139765' AS DateTime2), 4, CAST(N'2026-04-07T16:44:20.4332331' AS DateTime2), 4, 1, 4, CAST(N'2026-04-07T16:45:47.4221385' AS DateTime2))
SET IDENTITY_INSERT [dbo].[HoSoUngVien] OFF
GO
SET IDENTITY_INSERT [dbo].[DonUngTuyen] ON 

INSERT [dbo].[DonUngTuyen] ([MaDonUngTuyen], [MaCongViec], [TenUngVien], [SoDienThoai], [ThanhPho], [ThuGioiThieu], [DuongDanCv], [NgayNop], [TrangThai], [MaNguoiDung], [NgayPhongVan], [HinhThucPhongVan], [DiaDiemPhongVan], [GhiChuPhongVan]) VALUES (5, 16, N'Nguyễn Thị Hoài', N'0983967742', N'Hồ Chí Minh', N'Thế mà lại hay', N'existing_cv.pdf', CAST(N'2026-05-23T10:18:52.827' AS DateTime), N'Phỏng vấn', 12, NULL, NULL, NULL, NULL)
INSERT [dbo].[DonUngTuyen] ([MaDonUngTuyen], [MaCongViec], [TenUngVien], [SoDienThoai], [ThanhPho], [ThuGioiThieu], [DuongDanCv], [NgayNop], [TrangThai], [MaNguoiDung], [NgayPhongVan], [HinhThucPhongVan], [DiaDiemPhongVan], [GhiChuPhongVan]) VALUES (6, 15, N'Nguyễn Minh Thắng', N'0989460482', N'Hồ Chí Minh', N'Béo vl', N'existing_cv.pdf', CAST(N'2026-05-23T11:02:18.687' AS DateTime), N'Phỏng vấn', 15, NULL, NULL, NULL, NULL)
INSERT [dbo].[DonUngTuyen] ([MaDonUngTuyen], [MaCongViec], [TenUngVien], [SoDienThoai], [ThanhPho], [ThuGioiThieu], [DuongDanCv], [NgayNop], [TrangThai], [MaNguoiDung], [NgayPhongVan], [HinhThucPhongVan], [DiaDiemPhongVan], [GhiChuPhongVan]) VALUES (7, 14, N'Nguyễn Minh Thắng', N'0989460482', N'Hồ Chí Minh', N'Hay', N'existing_cv.pdf', CAST(N'2026-05-23T11:10:37.923' AS DateTime), N'Phỏng vấn', 15, N'15:34 26/05/2026', N'Online (Google Meet / Zoom)', N'Sẽ gửi link họp sau', NULL)
INSERT [dbo].[DonUngTuyen] ([MaDonUngTuyen], [MaCongViec], [TenUngVien], [SoDienThoai], [ThanhPho], [ThuGioiThieu], [DuongDanCv], [NgayNop], [TrangThai], [MaNguoiDung], [NgayPhongVan], [HinhThucPhongVan], [DiaDiemPhongVan], [GhiChuPhongVan]) VALUES (8, 14, N'Nguyễn Thị Hoài', NULL, N'Hồ Chí Minh', N'hay nuôn', N'http://localhost:5000/uploads/1780207850202_main-assembly-master-.pdf', CAST(N'2026-05-31T13:11:00.437' AS DateTime), N'Phỏng vấn', 12, N'13:11 31/05/2026', N'Online (Google Meet / Zoom)', N'kkk', N'chuẩn bị tinh thần')
INSERT [dbo].[DonUngTuyen] ([MaDonUngTuyen], [MaCongViec], [TenUngVien], [SoDienThoai], [ThanhPho], [ThuGioiThieu], [DuongDanCv], [NgayNop], [TrangThai], [MaNguoiDung], [NgayPhongVan], [HinhThucPhongVan], [DiaDiemPhongVan], [GhiChuPhongVan]) VALUES (9, 20, N'luong thanh tung', N'0961169306', N'Hồ Chí Minh', N'Hay', NULL, CAST(N'2026-06-02T12:19:14.010' AS DateTime), N'Phỏng vấn', 19, N'12:20 02/06/2026', N'Online (Google Meet / Zoom)', N'ok', N'Chuan bi CV')
SET IDENTITY_INSERT [dbo].[DonUngTuyen] OFF
GO
SET IDENTITY_INSERT [dbo].[CvUngVien] ON 

INSERT [dbo].[CvUngVien] ([Id], [MaNguoiDung], [GioiThieu], [KyNang], [NgayTao], [DuongDanFileCv], [TenFileCv]) VALUES (2, 12, N'Haha', NULL, CAST(N'2026-05-25T17:25:39.240' AS DateTime), NULL, NULL)
SET IDENTITY_INSERT [dbo].[CvUngVien] OFF
GO
SET IDENTITY_INSERT [dbo].[CongTy] ON 

INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (1, N'ANDPAD VietNam Co., Ltd', N'https://link-logo-apple.png', N'Mô tả công việc mặc định', N'https://google.com', N'TP. Hồ Chí Minh', 1, CAST(N'2026-04-29T14:32:24.870' AS DateTime), N'Sản phẩm', N'100-200 nhân sự', N'Việt Nam', N'Thứ 2 - Thứ 6', N'86 US$', CAST(4.3 AS Decimal(2, 1)), 500, N'ANDPAD là nền tảng quản lý xây dựng số 1 tại Nhật Bản, hiện đang mở rộng mạnh mẽ tại Việt Nam.', NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (2, N'Apple Store', N'https://cdn-icons-png.flaticon.com/512/882/882704.png', N'Gia nhập đội ngũ công nghệ hàng đầu', N'https://apple.com', N'Hà Nội', 1, CAST(N'2026-04-29T15:23:04.987' AS DateTime), N'Bán lẻ công nghệ', N'1000+ nhân sự', N'Hoa Kỳ', N'Thoả thuận', N'150 US$', CAST(4.8 AS Decimal(2, 1)), 1200, N'Môi trường làm việc đẳng cấp thế giới với các sản phẩm công nghệ đột phá.', NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (3, N'Google Corp', N'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', N'Môi trường sáng tạo toàn cầu', N'https://google.com', N'Đà Nẵng', 1, CAST(N'2026-04-29T15:23:04.987' AS DateTime), N'Dịch vụ Internet', N'10000+ nhân sự', N'Hoa Kỳ', N'Linh hoạt', N'200 US$', CAST(4.9 AS Decimal(2, 1)), 3500, N'Google luôn nằm trong top những nơi làm việc tốt nhất hành tinh với chế độ đãi ngộ cực cao.', NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (4, N'FPT Software', N'https://link-logo-fpt.png', N'Công ty công nghệ hàng đầu Việt Nam', N'https://fpt-software.com', N'TP. Hồ Chí Minh', 0, CAST(N'2026-04-29T15:23:04.987' AS DateTime), N'Outsourcing', N'30000+ nhân sự', N'Việt Nam', N'Thứ 2 - Thứ 6', N'45 US$', CAST(4.0 AS Decimal(2, 1)), 2100, N'Công ty xuất khẩu phần mềm lớn nhất Việt Nam với cơ hội làm việc tại Nhật Bản, Mỹ, Châu Âu.', NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (5, N'VNG Corporation', N'https://link-logo-vng.png', N'Kỳ lân công nghệ hàng đầu Việt Nam với các sản phẩm Zalo, Zing.', N'https://vng.com.vn', N'TP. Hồ Chí Minh', 1, CAST(N'2026-05-05T09:58:51.770' AS DateTime), N'Internet & Game', N'2000+ nhân sự', N'Việt Nam', N'Thứ 2 - Thứ 6', N'60 US$', CAST(4.2 AS Decimal(2, 1)), 850, N'Kỳ lân công nghệ đầu tiên của Việt Nam, sở hữu hệ sinh thái Zalo, Zing, VNGGames.', NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (6, N'Viettel Group', N'https://link-logo-viettel.png', N'Tập đoàn Công nghiệp - Viễn thông Quân đội.', N'https://viettel.com.vn', N'Hà Nội', 1, CAST(N'2026-05-05T09:58:51.770' AS DateTime), N'Viễn thông & CNTT', N'50000+ nhân sự', N'Việt Nam', N'Thứ 2 - Thứ 7', N'55 US$', CAST(4.1 AS Decimal(2, 1)), 1500, N'Tập đoàn viễn thông lớn nhất Việt Nam, tiên phong trong lĩnh vực 5G và chuyển đổi số quốc gia.', NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (7, N'Shopee Vietnam', N'https://link-logo-shopee.png', N'Nền tảng thương mại điện tử phổ biến nhất khu vực.', N'https://shopee.vn', N'TP. Hồ Chí Minh', 1, CAST(N'2026-05-05T09:58:51.770' AS DateTime), N'E-commerce', N'1500+ nhân sự', N'Singapore', N'Thứ 2 - Thứ 6', N'70 US$', CAST(4.4 AS Decimal(2, 1)), 900, N'Sàn thương mại điện tử hàng đầu Đông Nam Á với môi trường làm việc năng động, trẻ trung.', NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (8, N'Cty TNHH 1 Mjk Tao', N'http://localhost:5000/uploads/1779525857747_Picture1.svg', N'Chúng tôi là đơn vị tiên phong trong lĩnh vực giải pháp phần mềm, cam kết mang đến những sản phẩm công nghệ đột phá, tối ưu hóa quy trình vận hành và tạo ra giá trị bền vững cho đối tác và khách hàng', N'https://thaobeo.com', N'9 Đường Làng Thị Trấn Phú Xuyên Huyện Phú Xuyên Hà Nội 13906', 1, CAST(N'2026-05-21T15:13:40.360' AS DateTime), N'Công nghệ thông tin', N'1–10 người', N'Việt Nam', N'Thứ 2 - Thứ 6', N'2,000 USD', NULL, NULL, N'Về chúng tôi
Được thành lập với khát vọng chuyển đổi số, [Tên Công Ty] tự hào là đơn vị cung cấp các giải pháp công nghệ toàn diện từ phát triển phần mềm, ứng dụng di động cho đến tư vấn chuyển đổi số doanh nghiệp.
Sứ mệnh:
Xây dựng hệ sinh thái công nghệ thông minh, giúp các doanh nghiệp bứt phá trong kỷ nguyên số thông qua các giải pháp sáng tạo, bảo mật và hiệu quả cao.
Tầm nhìn:
Trở thành đối tác công nghệ tin cậy hàng đầu tại Việt Nam và khu vực, nơi hội tụ những tài năng công nghệ cùng nhau kiến tạo tương lai bền vững.
Giá trị cốt lõi:
Sáng tạo: Luôn cập nhật công nghệ mới nhất để giải quyết các bài toán khó.
Chất lượng: Đặt trải nghiệm người dùng và tính ổn định của hệ thống lên hàng đầu.
Tận tâm: Đồng hành cùng khách hàng trong suốt quá trình phát triển và vận hành.
Với đội ngũ kỹ sư tâm huyết và giàu kinh nghiệm, [Tên Công Ty] luôn sẵn sàng cùng bạn tạo nên những giá trị khác biệt.', N'0386283669', N'["http://localhost:5000/uploads/1779526250633_Picture3.svg","http://localhost:5000/uploads/1779700848247_365b24e2648883e3f11bd273778870d9.jpg"]')
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (9, N'Công ty TNHH Tungbeo', NULL, NULL, N'https://Tungbeo.com', N'PhuXuyen, HaNoi', 1, CAST(N'2026-05-23T09:43:42.757' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (10, N'VietJob Recruiter Inc', NULL, NULL, NULL, NULL, 0, CAST(N'2026-05-23T16:28:48.407' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[CongTy] ([MaCongTy], [TenCongTy], [DuongDanLogo], [MoTa], [DuongDanWebsite], [DiaDiem], [NoiBat], [NgayTao], [NganhNghe], [QuyMo], [QuocGia], [ThoiGianLamViec], [LuongTrungBinh], [DanhGia], [SoLuongDanhGia], [MoTaChiTiet], [DuongDayNong], [AnhVanPhong]) VALUES (11, N'Công ty TNHH ABC', NULL, NULL, N'https://abc.com', N'175 Tây Sơn, Đống Đa, Hà Nội', 1, CAST(N'2026-06-01T14:50:39.713' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[CongTy] OFF
GO
SET IDENTITY_INSERT [dbo].[DanhGiaCongTy] ON 

INSERT [dbo].[DanhGiaCongTy] ([Id], [MaCongTy], [MaNguoiDung], [DanhGia], [TomTat], [ChinhSachTangCa], [LyDoTangCa], [DiemYeuThich], [GopY], [NgayTao]) VALUES (1, 9, 12, 5, N'Hay ', N'satisfied', NULL, N'ăn', N'Chán', CAST(N'2026-05-27T11:34:29.140' AS DateTime))
SET IDENTITY_INSERT [dbo].[DanhGiaCongTy] OFF
GO
SET IDENTITY_INSERT [dbo].[BaoCaoCongViec] ON 

INSERT [dbo].[BaoCaoCongViec] ([MaBaoCao], [MaCongViec], [MaNguoiDung], [LyDo], [MoTa], [TrangThai], [NgayTao]) VALUES (1, 15, 12, N'Nội dung công việc sai lệch hoàn toàn so với mô tả thực tế', NULL, N'Resolved', CAST(N'2026-05-25T15:40:57.740' AS DateTime))
SET IDENTITY_INSERT [dbo].[BaoCaoCongViec] OFF
GO
SET IDENTITY_INSERT [dbo].[CongViec] ON 

INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (3, 1, N'QA/QC Engineer', N'15tr - 25tr', N'Toàn thời gian', N'2 năm', N'Quận 1, TP.HCM', N'Kiểm soát chất lượng phần mềm và viết test case.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'ReactJS, HTML, CSS', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (4, 2, N'Data Scientist', N'25,000 - 45,000', N'Toàn thời gian', N'3 năm', N'Hà Nội', N'Phân tích dữ liệu lớn và xây dựng thuật toán dự báo.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Python, AI, Data Analysis', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Thành thạo Python và các thư viện AI. • Tư duy toán học và thuật toán tốt. • Ưu tiên ứng viên có kinh nghiệm xử lý Big Data.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (5, 2, N'DevOps Engineer', N'20,000 - 35,000', N'Linh hoạt (Hybrid)', N'2 năm', N'Hà Nội', N'Quản lý hạ tầng cloud và triển khai CI/CD.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Docker, Jenkins, AWS, CI/CD', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (6, 3, N'UI/UX Designer', N'12tr - 22tr', N'Toàn thời gian', N'1 năm', N'Đà Nẵng', N'Thiết kế trải nghiệm người dùng cho ứng dụng di động.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'UI/UX, Adobe XD, Figma, Mobile Design', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Tối thiểu 2 năm kinh nghiệm thiết kế UI/UX. • Sử dụng thành thạo Figma, Adobe XD. • Có tư duy về trải nghiệm người dùng tốt.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (7, 3, N'PHP Developer (Laravel)', N'15tr - 28tr', N'Toàn thời gian', N'2 năm', N'Đà Nẵng', N'Phát triển hệ thống quản lý nội dung.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'PHP, Laravel, MySQL, HTML/CSS', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (8, 4, N'Business Analyst (BA)', N'20tr - 35tr', N'Toàn thời gian', N'3 năm', N'TP. Hồ Chí Minh', N'Phân tích yêu cầu nghiệp vụ và làm cầu nối với khách hàng.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Data Analysis, SQL, Communication, Agile', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (9, 4, N'HR Manager', N'25tr - 40tr', N'Toàn thời gian', N'5 năm', N'TP. Hồ Chí Minh', N'Quản lý nhân sự và xây dựng văn hóa công ty.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Recruitment, Training, Communication, Excel', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (10, 5, N'Fullstack Developer (.NET & Angular)', N'30tr - 45tr', N'Toàn thời gian', N'4 năm', N'Hà Nội', N'Phát triển cả frontend và backend cho dự án.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'.NET Core, Angular, SQL Server, C#', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (11, 5, N'System Administrator', N'18tr - 28tr', N'Toàn thời gian', N'2 năm', N'Hà Nội', N'Quản trị hệ thống mạng và máy chủ.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Windows Server, Networking, Security, Linux', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (12, 6, N'Android Developer (Kotlin)', N'22tr - 35tr', N'Toàn thời gian', N'2 năm', N'TP. Hồ Chí Minh', N'Xây dựng ứng dụng native trên nền tảng Android.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Kotlin, Android Studio, Firebase, MVVM', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (13, 6, N'Content Creator', N'10tr - 18tr', N'Bán thời gian', N'Không yêu cầu', N'TP. Hồ Chí Minh', N'Sáng tạo nội dung truyền thông cho các nền tảng mạng xã hội.', 1, CAST(N'2026-05-05T10:07:31.847' AS DateTime), N'Content Strategy, Copywriting, SEO, Social Media', N'Nhân viên', N'Không yêu cầu', CAST(N'2026-06-30T00:00:00.000' AS DateTime), N'• Nắm vững kiến thức nền tảng về ngôn ngữ lập trình tương ứng. • Có kỹ năng làm việc nhóm và giải quyết vấn đề tốt. • Đọc hiểu tài liệu kỹ thuật tiếng Anh.', N'• Lương tháng 13 + Thưởng hiệu quả công việc hàng năm. • Bảo hiểm sức khỏe cao cấp. • Du lịch hè, teambuilding hàng quý.', 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (14, 8, N'Fondent', N'12 triệu', N'Full-time', N'2 ănm', N'Ha Noi', N'aaaa', 1, CAST(N'2026-05-22T21:22:47.500' AS DateTime), N'Figma', N'Intern', N'Không yêu cầu', NULL, NULL, NULL, 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (15, 9, N'Frontend Developer (ReactJS)', N'12 triệu', N'Full-time', N'Không yêu cầu', N'Hà Nội', N'- Phát triển và bảo trì giao diện người dùng bằng ReactJS.
- Phối hợp với Backend Developer để tích hợp API.
- Tối ưu hiệu năng và trải nghiệm người dùng.
- Tham gia phân tích yêu cầu và đề xuất giải pháp kỹ thuật.
- Sửa lỗi và cải thiện các tính năng hiện có.', 1, CAST(N'2026-05-23T09:53:23.900' AS DateTime), N'ReactJS, JavaScript, HTML, CSS, REST API, Git', N'Intern', N'Không yêu cầu', NULL, NULL, NULL, 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (16, 9, N'Backend Developer (Node.js)', N'20 triệu', N'Full-time', N'2 năm', N'TP. Hồ Chí Minh', N'- Phát triển và bảo trì hệ thống backend sử dụng Node.js và ExpressJS.
- Thiết kế và tối ưu cơ sở dữ liệu SQL Server.
- Xây dựng RESTful API phục vụ Web và Mobile App.
- Tích hợp hệ thống xác thực JWT và phân quyền người dùng.
- Phối hợp với Frontend Developer và QA để triển khai sản phẩm.
- Tối ưu hiệu năng và bảo mật hệ thống.', 1, CAST(N'2026-05-23T10:14:43.427' AS DateTime), N'Node.js, ExpressJS, SQL Server, REST API, JWT, Git, Docker', N'Junior', N'Không yêu cầu', NULL, N'- Tối thiểu 3 năm kinh nghiệm Node.js.
- Thành thạo ExpressJS và SQL Server.
- Có kinh nghiệm thiết kế RESTful API.
- Hiểu về Authentication, Authorization, JWT.
- Biết sử dụng Docker là một lợi thế.
- Có khả năng làm việc nhóm và giải quyết vấn đề tốt.', NULL, 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (17, 8, N'Frontend Developer (ReactJS)', N'15 - 25 triệu', N'Full-time', N'1-2 năm', N'Hà Nội, Việt Nam', N'Thành thạo ReactJS, Tailwind CSS và JavaScript.
Có kinh nghiệm làm việc với RESTful API.
Có khả năng đọc hiểu tài liệu kỹ thuật tiếng Anh.
Chủ động, có tinh thần trách nhiệm trong công việc.', 0, CAST(N'2026-05-25T17:06:16.303' AS DateTime), N'ReactJS, Tailwind CSS, JavaScript, Redux, Git', N'Junior', N'Không yêu cầu', NULL, N'- Tốt nghiệp chuyên ngành Công nghệ thông tin hoặc tương đương.
- Có kinh nghiệm làm việc với ReactJS và Tailwind CSS.
- Có khả năng làm việc nhóm, đọc hiểu tài liệu tiếng Anh kỹ thuật tốt.
- Có tư duy tốt về UI/UX là một lợi thế.', NULL, 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (18, 8, N'Backend Developer (Node.js)', N'10 triệu', N'Full-time', N'1-2 năm', N'Hà Nội', N'Thiết kế và phát triển RESTful APIs cho hệ thống tuyển dụng VietJob.
Xây dựng, tối ưu hóa cơ sở dữ liệu (SQL Server) cho hệ thống tìm việc.
Xử lý xác thực người dùng (Authentication) bằng JWT và bảo mật API.
Viết tài liệu API và phối hợp chặt chẽ với team Frontend.', 1, CAST(N'2026-05-25T17:13:15.947' AS DateTime), N'Node.js, Express.js, SQL Server, JWT, Postman, Git, Microservices, System Architecture', N'Intern', N'Không yêu cầu', NULL, N'Thành thạo Node.js, Express.js.
Có kiến thức vững về SQL Server hoặc MongoDB.
Hiểu biết tốt về kiến trúc Microservices hoặc REST API.
Tư duy logic tốt, giải quyết vấn đề nhanh.', NULL, 0)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (19, 8, N'3D Artist', N'15 triệu', N'Full-time', N'2 năm', N'Hà Nội', N'Thiết kế, xây dựng mô hình 3D (Character, Environment, Props) dựa trên ý tưởng và concept ban đầu.
Thực hiện công đoạn UV Mapping, Texturing và Shading để hoàn thiện sản phẩm.
Phối hợp cùng team Game Dev/Design để tối ưu hóa asset đảm bảo hiệu năng khi hiển thị.
Tham gia vào quá trình render hoặc export asset phục vụ cho các dự án game/nội dung tương tác 3D.
Nghiên cứu và áp dụng các xu hướng thiết kế 3D mới để nâng cao chất lượng sản phẩm của VietJob.', 1, CAST(N'2026-06-01T11:42:57.397' AS DateTime), N'Blender, Zbrush, Maya', N'Junior', N'Không yêu cầu', NULL, N'Có kinh nghiệm tối thiểu 1-2 năm ở vị trí 3D Artist hoặc Designer.
Portfolio ấn tượng, thể hiện rõ tư duy về bố cục, ánh sáng và khả năng xử lý model.
Thành thạo các phần mềm: Blender, ZBrush, Maya (Ưu tiên ứng viên có kiến thức về pipeline làm game hoặc phim).
Có khả năng tối ưu hóa lưới (topology) cho các sản phẩm 3D.
Tư duy sáng tạo, chủ động trong công việc và có tinh thần học hỏi các công cụ mới.', NULL, 1)
INSERT [dbo].[CongViec] ([MaCongViec], [MaCongTy], [TieuDeCongViec], [MucLuong], [LoaiCongViec], [KinhNghiem], [DiaDiem], [MoTa], [TrangThaiHoatDong], [NgayTao], [KyNang], [CapBac], [GioiTinh], [HanNopHoSo], [YeuCau], [QuyenLoi], [NoiBat]) VALUES (20, 11, N'Intern UI design', N'8 triệu', N'Part-time', N'1 năm', N'TP.HCM', N'Hỗ trợ Team Design trong việc lên ý tưởng và thiết kế giao diện cho các dự án Web/App của công ty.
Chuyển đổi các Wireframe/Prototype từ ý tưởng thành giao diện chi tiết trên Figma.
Phối hợp chặt chẽ với đội ngũ Developer để đảm bảo giao diện được thực thi đúng thiết kế (Pixel Perfect).
Cập nhật, chỉnh sửa các thành phần giao diện (UI Components) dựa trên phản hồi của cấp trên.
Tham gia các buổi họp brainstorm để đóng góp ý tưởng cho trải nghiệm người dùng (UX).
Nghiên cứu các xu hướng thiết kế giao diện mới để cải thiện chất lượng sản phẩm.', 1, CAST(N'2026-06-01T14:57:17.240' AS DateTime), N'Figma, Photoshop', N'Intern', N'Không yêu cầu', NULL, N'Sinh viên năm cuối hoặc mới tốt nghiệp các chuyên ngành Thiết kế đồ họa, Mỹ thuật đa phương tiện hoặc các ngành liên quan.
Có tư duy thẩm mỹ tốt về bố cục, màu sắc và typography.
Sử dụng thành thạo bộ công cụ thiết kế: Figma, Photoshop, Illustrator.
Có Portfolio (Behance, Dribbble hoặc Website cá nhân) thể hiện được các dự án thiết kế UI/UX thực tế.
Có tinh thần cầu tiến, khả năng làm việc nhóm tốt và sẵn sàng học hỏi các quy trình thiết kế hiện đại.
Ưu tiên ứng viên có kiến thức cơ bản về quy tắc thiết kế giao diện trên nền tảng Mobile và Web.', NULL, 0)
SET IDENTITY_INSERT [dbo].[CongViec] OFF
GO
SET IDENTITY_INSERT [dbo].[KhoaHoc] ON 

INSERT [dbo].[KhoaHoc] ([Id], [MaNhaTuyenDung], [TieuDe], [MoTa], [TrangThai], [ThoiGianTao], [MaNguoiTao], [ThoiGianCapNhat], [MaNguoiCapNhat], [DaXoa], [MaNguoiXoa], [ThoiGianXoa], [DanhMuc], [DanhGia], [SoLuongDanhGia], [ThoiLuong], [SoBaiHoc], [TrinhDo], [TenGiangVien], [VaiTroGiangVien], [Gia], [GiaCu], [DuongDanDrive]) VALUES (1, 10, N'Khoá học lập trình Unity', N'Nhiều cái ', N'Đang bán', CAST(N'2026-05-22T22:41:37.8466667' AS DateTime2), 10, NULL, NULL, 1, 10, CAST(N'2026-05-22T22:42:12.4266667' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[KhoaHoc] ([Id], [MaNhaTuyenDung], [TieuDe], [MoTa], [TrangThai], [ThoiGianTao], [MaNguoiTao], [ThoiGianCapNhat], [MaNguoiCapNhat], [DaXoa], [MaNguoiXoa], [ThoiGianXoa], [DanhMuc], [DanhGia], [SoLuongDanhGia], [ThoiLuong], [SoBaiHoc], [TrinhDo], [TenGiangVien], [VaiTroGiangVien], [Gia], [GiaCu], [DuongDanDrive]) VALUES (2, 10, N'Khoá học Css', N'Ngon luôn', N'Đang bán', CAST(N'2026-05-22T22:43:02.2133333' AS DateTime2), 10, CAST(N'2026-05-22T22:43:20.6300000' AS DateTime2), 10, 1, 10, CAST(N'2026-06-01T10:28:47.9200000' AS DateTime2), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[KhoaHoc] ([Id], [MaNhaTuyenDung], [TieuDe], [MoTa], [TrangThai], [ThoiGianTao], [MaNguoiTao], [ThoiGianCapNhat], [MaNguoiCapNhat], [DaXoa], [MaNguoiXoa], [ThoiGianXoa], [DanhMuc], [DanhGia], [SoLuongDanhGia], [ThoiLuong], [SoBaiHoc], [TrinhDo], [TenGiangVien], [VaiTroGiangVien], [Gia], [GiaCu], [DuongDanDrive]) VALUES (3, 10, N'Làm chủ ReactJS và Tailwind CSS hiện đại', N'Khoá học cung cấp tư duy xây dựng giao diện chuẩn, tối ưu hoá component với ReactJS kết hợp styling chuyên sâu bằng Tailwind CSS.', N'Đang bán', CAST(N'2026-06-01T10:44:08.6766667' AS DateTime2), 10, NULL, NULL, 1, 10, CAST(N'2026-06-01T10:46:38.7300000' AS DateTime2), N'web', CAST(4.8 AS Decimal(2, 1)), 24, N'45 giờ', 50, N'Mọi trình độ', N'Nguyễn Văn A', N'Đối tác Đào tạo VietJob', 1500000, 3000000, NULL)
INSERT [dbo].[KhoaHoc] ([Id], [MaNhaTuyenDung], [TieuDe], [MoTa], [TrangThai], [ThoiGianTao], [MaNguoiTao], [ThoiGianCapNhat], [MaNguoiCapNhat], [DaXoa], [MaNguoiXoa], [ThoiGianXoa], [DanhMuc], [DanhGia], [SoLuongDanhGia], [ThoiLuong], [SoBaiHoc], [TrinhDo], [TenGiangVien], [VaiTroGiangVien], [Gia], [GiaCu], [DuongDanDrive]) VALUES (4, 10, N'Làm chủ ReactJS và Tailwind CSS hiện đại', N'Khoá học cung cấp tư duy xây dựng giao diện chuẩn, tối ưu hoá component với ReactJS kết hợp styling chuyên sâu bằng Tailwind CSS.', N'Đang bán', CAST(N'2026-06-01T10:46:55.8800000' AS DateTime2), 10, CAST(N'2026-06-01T10:47:13.8300000' AS DateTime2), NULL, 0, NULL, NULL, N'web', CAST(4.8 AS Decimal(2, 1)), 24, N'45 giờ', 50, N'Mọi trình độ', N'Nguyen Van A', N'Đối tác Đào tạo VietJob', 1500000, 3000000, NULL)
INSERT [dbo].[KhoaHoc] ([Id], [MaNhaTuyenDung], [TieuDe], [MoTa], [TrangThai], [ThoiGianTao], [MaNguoiTao], [ThoiGianCapNhat], [MaNguoiCapNhat], [DaXoa], [MaNguoiXoa], [ThoiGianXoa], [DanhMuc], [DanhGia], [SoLuongDanhGia], [ThoiLuong], [SoBaiHoc], [TrinhDo], [TenGiangVien], [VaiTroGiangVien], [Gia], [GiaCu], [DuongDanDrive]) VALUES (5, 10, N'Làm chủ Blender', N'UV, Modeling, texture...', N'Đang bán', CAST(N'2026-06-01T10:52:30.2733333' AS DateTime2), 10, CAST(N'2026-06-01T10:52:36.2866667' AS DateTime2), NULL, 0, NULL, NULL, N'design-gamedev', CAST(4.8 AS Decimal(2, 1)), 24, N'45 giờ', 40, N'Mọi trình độ', N'Lương Đại Dương', N'Đối tác Đào tạo VietJob', 1500000, 4000000, NULL)
INSERT [dbo].[KhoaHoc] ([Id], [MaNhaTuyenDung], [TieuDe], [MoTa], [TrangThai], [ThoiGianTao], [MaNguoiTao], [ThoiGianCapNhat], [MaNguoiCapNhat], [DaXoa], [MaNguoiXoa], [ThoiGianXoa], [DanhMuc], [DanhGia], [SoLuongDanhGia], [ThoiLuong], [SoBaiHoc], [TrinhDo], [TenGiangVien], [VaiTroGiangVien], [Gia], [GiaCu], [DuongDanDrive]) VALUES (6, 18, N'Lập trình C++', N'Lập trình UE5 dùng C++', N'Đang bán', CAST(N'2026-06-01T15:24:46.5933333' AS DateTime2), 18, CAST(N'2026-06-01T15:25:02.8400000' AS DateTime2), NULL, 0, NULL, NULL, N'design-gamedev', CAST(4.8 AS Decimal(2, 1)), 24, N'45 giờ', 40, N'Cơ bản', N'Lương Đại Dương', N'Đối tác Đào tạo VietJob', 2000000, 3000000, N'https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course')
SET IDENTITY_INSERT [dbo].[KhoaHoc] OFF
GO
SET IDENTITY_INSERT [dbo].[TinNhan] ON 

INSERT [dbo].[TinNhan] ([MaTinNhan], [MaNguoiGui], [MaNguoiNhan], [NoiDungTinNhan], [NgayTao], [DaDoc], [DuongDanDinhKem], [TenFileDinhKem]) VALUES (1, 15, 10, N'Chào anh/chị, tôi rất quan tâm đến vị trí tuyển dụng và muốn trao đổi thêm.', CAST(N'2026-05-25T15:30:07.787' AS DateTime), 1, NULL, NULL)
INSERT [dbo].[TinNhan] ([MaTinNhan], [MaNguoiGui], [MaNguoiNhan], [NoiDungTinNhan], [NgayTao], [DaDoc], [DuongDanDinhKem], [TenFileDinhKem]) VALUES (2, 10, 15, N'ok', CAST(N'2026-05-25T15:30:33.950' AS DateTime), 1, NULL, NULL)
INSERT [dbo].[TinNhan] ([MaTinNhan], [MaNguoiGui], [MaNguoiNhan], [NoiDungTinNhan], [NgayTao], [DaDoc], [DuongDanDinhKem], [TenFileDinhKem]) VALUES (3, 15, 11, N'Chào công ty, tôi đã ứng tuyển và muốn gửi lời chào đến HR đại diện.', CAST(N'2026-05-25T15:31:05.343' AS DateTime), 0, NULL, NULL)
INSERT [dbo].[TinNhan] ([MaTinNhan], [MaNguoiGui], [MaNguoiNhan], [NoiDungTinNhan], [NgayTao], [DaDoc], [DuongDanDinhKem], [TenFileDinhKem]) VALUES (4, 12, 10, N'dmm', CAST(N'2026-05-25T15:32:44.120' AS DateTime), 1, NULL, NULL)
INSERT [dbo].[TinNhan] ([MaTinNhan], [MaNguoiGui], [MaNguoiNhan], [NoiDungTinNhan], [NgayTao], [DaDoc], [DuongDanDinhKem], [TenFileDinhKem]) VALUES (5, 10, 12, N'???', CAST(N'2026-05-25T15:32:55.347' AS DateTime), 1, NULL, NULL)
SET IDENTITY_INSERT [dbo].[TinNhan] OFF
GO
SET IDENTITY_INSERT [dbo].[ThongBao] ON 

INSERT [dbo].[ThongBao] ([MaThongBao], [MaNguoiDung], [LoaiThongBao], [TieuDe], [NoiDung], [DaDoc], [NgayTao], [MaLienQuan]) VALUES (1, 12, N'invite', N'Lời mời phỏng vấn từ Cty TNHH 1 Mjk Tao', N'Đơn ứng tuyển vị trí "Fondent" của bạn đã được Cty TNHH 1 Mjk Tao chấp nhận. Họ mời bạn tham gia phỏng vấn!', 1, CAST(N'2026-05-31T13:11:46.520' AS DateTime), 8)
INSERT [dbo].[ThongBao] ([MaThongBao], [MaNguoiDung], [LoaiThongBao], [TieuDe], [NoiDung], [DaDoc], [NgayTao], [MaLienQuan]) VALUES (2, 19, N'invite', N'Lời mời phỏng vấn từ Công ty TNHH ABC', N'Đơn ứng tuyển vị trí "Intern UI design" của bạn đã được Công ty TNHH ABC chấp nhận. Họ mời bạn tham gia phỏng vấn!', 1, CAST(N'2026-06-02T12:20:33.707' AS DateTime), 9)
SET IDENTITY_INSERT [dbo].[ThongBao] OFF
GO
SET IDENTITY_INSERT [dbo].[VaiTro] ON 

INSERT [dbo].[VaiTro] ([MaVaiTro], [TenVaiTro]) VALUES (1, N'Admin')
INSERT [dbo].[VaiTro] ([MaVaiTro], [TenVaiTro]) VALUES (2, N'Candidate')
INSERT [dbo].[VaiTro] ([MaVaiTro], [TenVaiTro]) VALUES (3, N'Employer')
SET IDENTITY_INSERT [dbo].[VaiTro] OFF
GO
SET IDENTITY_INSERT [dbo].[KyNang] ON 

INSERT [dbo].[KyNang] ([MaKyNang], [TenKyNang]) VALUES (2, N'Golang')
INSERT [dbo].[KyNang] ([MaKyNang], [TenKyNang]) VALUES (4, N'Node.js')
INSERT [dbo].[KyNang] ([MaKyNang], [TenKyNang]) VALUES (3, N'ReactJS')
INSERT [dbo].[KyNang] ([MaKyNang], [TenKyNang]) VALUES (1, N'Ruby')
SET IDENTITY_INSERT [dbo].[KyNang] OFF
GO
SET IDENTITY_INSERT [dbo].[GiaoDich] ON 

INSERT [dbo].[GiaoDich] ([Id], [MaNguoiDung], [TieuDe], [SoTien], [LoaiGiaoDich], [TrangThai], [NgayTao], [MaThamChieu]) VALUES (1, 10, N'Thanh toán tin nổi bật VIP (Job ID: 19)', -1000000, N'ThanhToan', N'ThanhCong', CAST(N'2026-06-01T14:30:52.773' AS DateTime), N'HDN7527209')
INSERT [dbo].[GiaoDich] ([Id], [MaNguoiDung], [TieuDe], [SoTien], [LoaiGiaoDich], [TrangThai], [NgayTao], [MaThamChieu]) VALUES (2, 18, N'Nạp tiền vào ví qua Vietcombank QR', 10000000, N'Nap', N'ThanhCong', CAST(N'2026-06-01T15:04:56.913' AS DateTime), N'NAP3776383')
INSERT [dbo].[GiaoDich] ([Id], [MaNguoiDung], [TieuDe], [SoTien], [LoaiGiaoDich], [TrangThai], [NgayTao], [MaThamChieu]) VALUES (3, 18, N'Thanh toán tin nổi bật VIP (Job ID: undefined)', -1000000, N'ThanhToan', N'ThanhCong', CAST(N'2026-06-01T15:07:00.873' AS DateTime), N'HDN9273021')
INSERT [dbo].[GiaoDich] ([Id], [MaNguoiDung], [TieuDe], [SoTien], [LoaiGiaoDich], [TrangThai], [NgayTao], [MaThamChieu]) VALUES (4, 18, N'Đăng ký gói VIP doanh nghiệp (Nổi bật Công ty & Tin tuyển dụng trên Trang chủ)', -3000000, N'ThanhToan', N'ThanhCong', CAST(N'2026-06-01T15:14:29.283' AS DateTime), N'HDN9884150')
INSERT [dbo].[GiaoDich] ([Id], [MaNguoiDung], [TieuDe], [SoTien], [LoaiGiaoDich], [TrangThai], [NgayTao], [MaThamChieu]) VALUES (5, 12, N'Thanh toán mua khóa học: Lập trình C++', -2000000, N'ThanhToan', N'ThanhCong', CAST(N'2026-06-01T15:51:39.813' AS DateTime), N'CSH5839729')
INSERT [dbo].[GiaoDich] ([Id], [MaNguoiDung], [TieuDe], [SoTien], [LoaiGiaoDich], [TrangThai], [NgayTao], [MaThamChieu]) VALUES (6, 18, N'Doanh thu bán khóa học: Lập trình C++ (85%) từ học viên Nguyễn Thị Hoài', 1700000, N'BanKhoaHoc', N'ThanhCong', CAST(N'2026-06-01T15:51:39.820' AS DateTime), N'CSR1020099')
INSERT [dbo].[GiaoDich] ([Id], [MaNguoiDung], [TieuDe], [SoTien], [LoaiGiaoDich], [TrangThai], [NgayTao], [MaThamChieu]) VALUES (7, 10, N'Nạp tiền vào ví qua Vietcombank QR', 2000000, N'Nap', N'ThanhCong', CAST(N'2026-06-03T12:28:17.447' AS DateTime), N'NAP9977301')
SET IDENTITY_INSERT [dbo].[GiaoDich] OFF
GO
SET IDENTITY_INSERT [dbo].[DangKiKhoahoc] ON 

INSERT [dbo].[DangKiKhoahoc] ([MaKhoaHocNguoiDung], [MaNguoiDung], [MaKhoaHoc], [TrangThai], [NgayTao], [CapNhatLanCuoi]) VALUES (1, 12, N'2', N'Đang theo học', CAST(N'2026-06-01T10:17:12.190' AS DateTime), CAST(N'2026-06-01T10:17:12.190' AS DateTime))
INSERT [dbo].[DangKiKhoahoc] ([MaKhoaHocNguoiDung], [MaNguoiDung], [MaKhoaHoc], [TrangThai], [NgayTao], [CapNhatLanCuoi]) VALUES (3, 12, N'4', N'Đang theo học', CAST(N'2026-06-01T10:49:52.080' AS DateTime), CAST(N'2026-06-01T10:49:52.080' AS DateTime))
INSERT [dbo].[DangKiKhoahoc] ([MaKhoaHocNguoiDung], [MaNguoiDung], [MaKhoaHoc], [TrangThai], [NgayTao], [CapNhatLanCuoi]) VALUES (4, 12, N'5', N'Đang theo học', CAST(N'2026-06-01T10:52:52.253' AS DateTime), CAST(N'2026-06-01T15:16:26.213' AS DateTime))
INSERT [dbo].[DangKiKhoahoc] ([MaKhoaHocNguoiDung], [MaNguoiDung], [MaKhoaHoc], [TrangThai], [NgayTao], [CapNhatLanCuoi]) VALUES (5, 12, N'6', N'Đang theo học', CAST(N'2026-06-01T15:51:39.827' AS DateTime), CAST(N'2026-06-01T15:51:39.827' AS DateTime))
SET IDENTITY_INSERT [dbo].[DangKiKhoahoc] OFF
GO
INSERT [dbo].[VaiTroNguoiDung] ([MaNguoiDung], [MaVaiTro]) VALUES (1, 1)
INSERT [dbo].[VaiTroNguoiDung] ([MaNguoiDung], [MaVaiTro]) VALUES (10, 3)
INSERT [dbo].[VaiTroNguoiDung] ([MaNguoiDung], [MaVaiTro]) VALUES (11, 3)
INSERT [dbo].[VaiTroNguoiDung] ([MaNguoiDung], [MaVaiTro]) VALUES (12, 2)
INSERT [dbo].[VaiTroNguoiDung] ([MaNguoiDung], [MaVaiTro]) VALUES (14, 2)
INSERT [dbo].[VaiTroNguoiDung] ([MaNguoiDung], [MaVaiTro]) VALUES (15, 2)
INSERT [dbo].[VaiTroNguoiDung] ([MaNguoiDung], [MaVaiTro]) VALUES (18, 3)
INSERT [dbo].[VaiTroNguoiDung] ([MaNguoiDung], [MaVaiTro]) VALUES (19, 2)
GO
SET IDENTITY_INSERT [dbo].[NguoiDung] ON 

INSERT [dbo].[NguoiDung] ([Id], [TenDangNhap], [MatKhau], [Email], [NgayTao], [TrangThai], [SoDienThoai], [DiaChi], [MaCongTy], [SoDu]) VALUES (1, N'Duong', N'$2b$10$qN6WxoDvKUM6H2RcozvRZO/51VKyoPQX179gi1p1uY6GOffZFml3C', N'luongduongess@gmail.com', CAST(N'2026-04-20T21:53:18.533' AS DateTime), NULL, NULL, NULL, NULL, 5000000)
INSERT [dbo].[NguoiDung] ([Id], [TenDangNhap], [MatKhau], [Email], [NgayTao], [TrangThai], [SoDienThoai], [DiaChi], [MaCongTy], [SoDu]) VALUES (10, N'Đỗ Phương Thảo', N'$2b$10$txKXiwN1l4GUtROrweqwBO0CaAX5kA7VIG8dJ5p7yfEso5gbVWzqO', N'thaodo9683@gmail.com', CAST(N'2026-05-21T15:13:40.453' AS DateTime), N'Approved', NULL, NULL, 8, 6000000)
INSERT [dbo].[NguoiDung] ([Id], [TenDangNhap], [MatKhau], [Email], [NgayTao], [TrangThai], [SoDienThoai], [DiaChi], [MaCongTy], [SoDu]) VALUES (11, N'Lương Thanh Tùng', N'$2b$10$DXx7oq0rxmRCjWoxRf3FWuFJaDnohbOb3QkwNCcvFE3cNrYTJ5yry', N'luongtung26022004@gmail.com', CAST(N'2026-05-23T09:43:42.833' AS DateTime), N'Approved', NULL, NULL, 9, 5000000)
INSERT [dbo].[NguoiDung] ([Id], [TenDangNhap], [MatKhau], [Email], [NgayTao], [TrangThai], [SoDienThoai], [DiaChi], [MaCongTy], [SoDu]) VALUES (12, N'Nguyễn Thị Hoài', N'$2b$10$/AJyXpCo5nZrm40gAjkKuuWOP6JGsMS.1XWs2FpQHABwUoY7zl6u.', N'nhoai2007@gmail.com', CAST(N'2026-05-23T09:57:03.030' AS DateTime), N'Pending', NULL, NULL, NULL, 3000000)
INSERT [dbo].[NguoiDung] ([Id], [TenDangNhap], [MatKhau], [Email], [NgayTao], [TrangThai], [SoDienThoai], [DiaChi], [MaCongTy], [SoDu]) VALUES (14, N'Vũ Bá Thành', N'$2b$10$mfgKOIlia/5gfYLVayOzNOiwrVmA9XWuYjFKoSV8U0gkndgl1klL6', N'vubathanh2004@gmail.com', CAST(N'2026-05-23T10:49:11.623' AS DateTime), N'Pending', NULL, NULL, NULL, 5000000)
INSERT [dbo].[NguoiDung] ([Id], [TenDangNhap], [MatKhau], [Email], [NgayTao], [TrangThai], [SoDienThoai], [DiaChi], [MaCongTy], [SoDu]) VALUES (15, N'Nguyễn Minh Thắng', N'$2b$10$0De1TYkM4by.ZV0z8ZNlEex31xI4aHFlu2vP6Z4bjN9HwVT5ToLFW', N'an26220004@gmail.com', CAST(N'2026-05-23T11:01:54.153' AS DateTime), N'Pending', N'0963329076', NULL, NULL, 5000000)
INSERT [dbo].[NguoiDung] ([Id], [TenDangNhap], [MatKhau], [Email], [NgayTao], [TrangThai], [SoDienThoai], [DiaChi], [MaCongTy], [SoDu]) VALUES (18, N'Vũ Xuân Thành', N'$2b$10$D/sCYMVf2ySiIlwMz1xI0Orxtn/dxli1uOZX6lT4t.zcRL6X7QHLy', N'vxt233@gmail.com', CAST(N'2026-06-01T14:50:39.783' AS DateTime), N'Approved', NULL, NULL, 11, 12700000)
INSERT [dbo].[NguoiDung] ([Id], [TenDangNhap], [MatKhau], [Email], [NgayTao], [TrangThai], [SoDienThoai], [DiaChi], [MaCongTy], [SoDu]) VALUES (19, N'luong thanh tung', N'$2b$10$oPChFUMvoToGqKGsYKp7PeXItmQewon43h4WphPLF4w2WeCTk7X4m', N'tungluong262004@gmail.com', CAST(N'2026-06-02T12:09:05.217' AS DateTime), N'Pending', N'0961169306', NULL, NULL, 5000000)
SET IDENTITY_INSERT [dbo].[NguoiDung] OFF
GO
/****** Object:  Index [UQ__Candidat__1788CC4D1E755538]    Script Date: 6/7/2026 10:38:38 AM ******/
ALTER TABLE [dbo].[CvUngVien] ADD UNIQUE NONCLUSTERED 
(
	[MaNguoiDung] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__VaiTro__8A2B6160B653A9C8]    Script Date: 6/7/2026 10:38:38 AM ******/
ALTER TABLE [dbo].[VaiTro] ADD UNIQUE NONCLUSTERED 
(
	[TenVaiTro] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__KyNang__B63C6571969368B2]    Script Date: 6/7/2026 10:38:38 AM ******/
ALTER TABLE [dbo].[KyNang] ADD UNIQUE NONCLUSTERED 
(
	[TenKyNang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[DonUngTuyen] ADD  DEFAULT (getdate()) FOR [NgayNop]
GO
ALTER TABLE [dbo].[DonUngTuyen] ADD  DEFAULT (N'Đang chờ duyệt') FOR [TrangThai]
GO
ALTER TABLE [dbo].[CvUngVien] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[FileUngVien] ADD  DEFAULT (getdate()) FOR [NgayTaiLen]
GO
ALTER TABLE [dbo].[CongTy] ADD  DEFAULT ((0)) FOR [NoiBat]
GO
ALTER TABLE [dbo].[CongTy] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[DanhGiaCongTy] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[BaoCaoCongViec] ADD  DEFAULT ('Pending') FOR [TrangThai]
GO
ALTER TABLE [dbo].[BaoCaoCongViec] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[CongViec] ADD  DEFAULT ((1)) FOR [TrangThaiHoatDong]
GO
ALTER TABLE [dbo].[CongViec] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[CongViec] ADD  DEFAULT ((0)) FOR [NoiBat]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT ('web') FOR [DanhMuc]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT ((4.8)) FOR [DanhGia]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT ((24)) FOR [SoLuongDanhGia]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT (N'45 giờ') FOR [ThoiLuong]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT ((50)) FOR [SoBaiHoc]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT (N'Mọi trình độ') FOR [TrinhDo]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT (N'Đỗ Phương Thảo') FOR [TenGiangVien]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT (N'Đối tác Đào tạo VietJob') FOR [VaiTroGiangVien]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT ((1500000)) FOR [Gia]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT ((3000000)) FOR [GiaCu]
GO
ALTER TABLE [dbo].[KhoaHoc] ADD  DEFAULT ('https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course') FOR [DuongDanDrive]
GO
ALTER TABLE [dbo].[TinNhan] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[TinNhan] ADD  DEFAULT ((0)) FOR [DaDoc]
GO
ALTER TABLE [dbo].[ThongBao] ADD  DEFAULT ('system') FOR [LoaiThongBao]
GO
ALTER TABLE [dbo].[ThongBao] ADD  DEFAULT ((0)) FOR [DaDoc]
GO
ALTER TABLE [dbo].[ThongBao] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[TuKhoaPhoBien] ADD  DEFAULT ((0)) FOR [SoLuotTimKiem]
GO
ALTER TABLE [dbo].[GiaoDich] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[DangKiKhoahoc] ADD  DEFAULT (N'Đang quan tâm') FOR [TrangThai]
GO
ALTER TABLE [dbo].[DangKiKhoahoc] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[DangKiKhoahoc] ADD  DEFAULT (getdate()) FOR [CapNhatLanCuoi]
GO
ALTER TABLE [dbo].[NguoiDung] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[NguoiDung] ADD  DEFAULT ('Pending') FOR [TrangThai]
GO
ALTER TABLE [dbo].[NguoiDung] ADD  DEFAULT ((5000000)) FOR [SoDu]
GO
ALTER TABLE [dbo].[NguoiDungBoilerplate]  WITH CHECK ADD  CONSTRAINT [FK_NguoiDungBoilerplate_NguoiDungBoilerplate_CreatorUserId] FOREIGN KEY([MaNguoiTao])
REFERENCES [dbo].[NguoiDungBoilerplate] ([Id])
GO
ALTER TABLE [dbo].[NguoiDungBoilerplate] CHECK CONSTRAINT [FK_NguoiDungBoilerplate_NguoiDungBoilerplate_CreatorUserId]
GO
ALTER TABLE [dbo].[NguoiDungBoilerplate]  WITH CHECK ADD  CONSTRAINT [FK_NguoiDungBoilerplate_NguoiDungBoilerplate_DeleterUserId] FOREIGN KEY([MaNguoiXoa])
REFERENCES [dbo].[NguoiDungBoilerplate] ([Id])
GO
ALTER TABLE [dbo].[NguoiDungBoilerplate] CHECK CONSTRAINT [FK_NguoiDungBoilerplate_NguoiDungBoilerplate_DeleterUserId]
GO
ALTER TABLE [dbo].[NguoiDungBoilerplate]  WITH CHECK ADD  CONSTRAINT [FK_NguoiDungBoilerplate_NguoiDungBoilerplate_LastModifierUserId] FOREIGN KEY([MaNguoiCapNhatCuoi])
REFERENCES [dbo].[NguoiDungBoilerplate] ([Id])
GO
ALTER TABLE [dbo].[NguoiDungBoilerplate] CHECK CONSTRAINT [FK_NguoiDungBoilerplate_NguoiDungBoilerplate_LastModifierUserId]
GO
ALTER TABLE [dbo].[HoSoUngVien]  WITH CHECK ADD  CONSTRAINT [FK_HoSoUngVien_NguoiDungBoilerplate_UserId] FOREIGN KEY([MaNguoiDung])
REFERENCES [dbo].[NguoiDungBoilerplate] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HoSoUngVien] CHECK CONSTRAINT [FK_HoSoUngVien_NguoiDungBoilerplate_UserId]
GO
ALTER TABLE [dbo].[DonUngTuyen]  WITH CHECK ADD FOREIGN KEY([MaCongViec])
REFERENCES [dbo].[CongViec] ([MaCongViec])
GO
ALTER TABLE [dbo].[CvUngVien]  WITH CHECK ADD FOREIGN KEY([MaNguoiDung])
REFERENCES [dbo].[NguoiDung] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[HocVanCv]  WITH CHECK ADD FOREIGN KEY([MaCv])
REFERENCES [dbo].[CvUngVien] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[KinhNghiemCv]  WITH CHECK ADD FOREIGN KEY([MaCv])
REFERENCES [dbo].[CvUngVien] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[BaoCaoCongViec]  WITH CHECK ADD FOREIGN KEY([MaCongViec])
REFERENCES [dbo].[CongViec] ([MaCongViec])
GO
ALTER TABLE [dbo].[BaoCaoCongViec]  WITH CHECK ADD FOREIGN KEY([MaNguoiDung])
REFERENCES [dbo].[NguoiDung] ([Id])
GO
ALTER TABLE [dbo].[CongViec]  WITH CHECK ADD FOREIGN KEY([MaCongTy])
REFERENCES [dbo].[CongTy] ([MaCongTy])
GO
ALTER TABLE [dbo].[KyNangCongViec]  WITH CHECK ADD FOREIGN KEY([MaCongViec])
REFERENCES [dbo].[CongViec] ([MaCongViec])
GO
ALTER TABLE [dbo].[KyNangCongViec]  WITH CHECK ADD FOREIGN KEY([MaKyNang])
REFERENCES [dbo].[KyNang] ([MaKyNang])
GO
ALTER TABLE [dbo].[TinNhan]  WITH CHECK ADD FOREIGN KEY([MaNguoiNhan])
REFERENCES [dbo].[NguoiDung] ([Id])
GO
ALTER TABLE [dbo].[TinNhan]  WITH CHECK ADD FOREIGN KEY([MaNguoiGui])
REFERENCES [dbo].[NguoiDung] ([Id])
GO
ALTER TABLE [dbo].[ThongBao]  WITH CHECK ADD FOREIGN KEY([MaNguoiDung])
REFERENCES [dbo].[NguoiDung] ([Id])
GO
ALTER TABLE [dbo].[DangKiKhoahoc]  WITH CHECK ADD FOREIGN KEY([MaNguoiDung])
REFERENCES [dbo].[NguoiDung] ([Id])
GO
ALTER TABLE [dbo].[VaiTroNguoiDung]  WITH CHECK ADD  CONSTRAINT [FK_Role] FOREIGN KEY([MaVaiTro])
REFERENCES [dbo].[VaiTro] ([MaVaiTro])
GO
ALTER TABLE [dbo].[VaiTroNguoiDung] CHECK CONSTRAINT [FK_Role]
GO
ALTER TABLE [dbo].[VaiTroNguoiDung]  WITH CHECK ADD  CONSTRAINT [FK_User] FOREIGN KEY([MaNguoiDung])
REFERENCES [dbo].[NguoiDung] ([Id])
GO
ALTER TABLE [dbo].[VaiTroNguoiDung] CHECK CONSTRAINT [FK_User]
GO
ALTER TABLE [dbo].[NguoiDung]  WITH CHECK ADD FOREIGN KEY([MaCongTy])
REFERENCES [dbo].[CongTy] ([MaCongTy])
GO
ALTER TABLE [dbo].[DanhGiaCongTy]  WITH CHECK ADD CHECK  (([DanhGia]>=(1) AND [DanhGia]<=(5)))
GO
