using System;
using Abp.Domain.Entities;

public class ThongBao : Entity<int>
{
    public int NguoiDungId { get; set; }
    public string NoiDung { get; set; }
    public bool DaDoc { get; set; }
    public DateTime NgayTao { get; set; }
}