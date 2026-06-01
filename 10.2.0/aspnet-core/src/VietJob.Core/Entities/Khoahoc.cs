using Abp.Domain.Entities;
using System;

public class KhoaHoc : Entity<int>
{
    public int NhaTuyenDungId { get; set; }
    public string TieuDe { get; set; }
    public string MoTa { get; set; }
    public string TrangThai { get; set; }
    public DateTime NgayTao { get; set; }
}