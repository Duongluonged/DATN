using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VietJob.Authorization.Roles;
using VietJob.Authorization.Users;
using VietJob.Entities;
using VietJob.MultiTenancy;

namespace VietJob.EntityFrameworkCore;

public class VietJobDbContext : AbpZeroDbContext<Tenant, Role, User, VietJobDbContext>
{
    /* Define a DbSet for each entity of the application */

    public VietJobDbContext(DbContextOptions<VietJobDbContext> options)
        : base(options)
    {
    }
    public DbSet<KhoaHoc> KhoaHocs { get; set; }
    public DbSet<NguoiDung> NguoiDungs { get; set; }
    public DbSet<UngVien> UngViens { get; set; }
    public DbSet<NhaTuyenDung> NhaTuyenDungs { get; set; }
    public DbSet<TinTuyenDung> TinTuyenDungs { get; set; }
    public DbSet<CV> CVs { get; set; }
    public DbSet<HoSoUngTuyen> HoSoUngTuyens { get; set; }
    public DbSet<DanhMuc> DanhMucs { get; set; }
    public DbSet<DiaDiem> DiaDiems { get; set; }
    public DbSet<ThongBao> ThongBaos { get; set; }

    public DbSet<DanhGia> DanhGias { get; set; }

    public DbSet<ViTien> ViTiens { get; set; }
    public DbSet<GiaoDich> GiaoDiches { get; set; }
    public DbSet<ViecDaLuu> ViecDaLuus { get; set; }

    public DbSet<Admin> Admins { get; set; }
    // ... các DbSet khác như NguoiDung, TinTuyenDung ...

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình quan hệ 1-1 giữa NguoiDung và Admin
        modelBuilder.Entity<Admin>()
            .HasOne(a => a.NguoiDung)
            .WithMany()
            .HasForeignKey(a => a.NguoiDungId)
            .OnDelete(DeleteBehavior.Cascade); // Xóa user thì xóa luôn thông tin admin
    }
}
