using System;
using Abp.Domain.Entities;

public class GiaoDich : Entity<int>
{
    public int ViTienId { get; set; }
    public decimal SoTien { get; set; }
    public string Loai { get; set; }
    public DateTime NgayTao { get; set; }
}