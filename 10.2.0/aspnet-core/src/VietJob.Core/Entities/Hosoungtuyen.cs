using System;
using Abp.Domain.Entities;

public class HoSoUngTuyen : Entity<int>
{
    public int UngVienId { get; set; }
    public int TinTuyenDungId { get; set; }
    public int CVId { get; set; }
    public string TrangThai { get; set; }
    public DateTime NgayUngTuyen { get; set; }
}