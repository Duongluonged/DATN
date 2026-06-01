using System;
using Abp.Domain.Entities;

public class CV : Entity<int>
{
    public int Id { get; set; }
    public int UngVienId { get; set; }
    public string TieuDe { get; set; }
    public string DuongDanFile { get; set; }
    public DateTime NgayTao { get; set; }
}