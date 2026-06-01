using Abp.Domain.Entities;
using System;

public class NguoiDung : Entity<int>
{
    public string Email { get; set; }
    public string MatKhau { get; set; }
    public string VaiTro { get; set; }
    public string TrangThai { get; set; }
    public DateTime NgayTao { get; set; }
}