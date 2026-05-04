using System;
using Abp.Domain.Entities;

public class DanhGia : Entity<int>
{
    public int UngVienId { get; set; }
    public int NhaTuyenDungId { get; set; }
    public int Diem { get; set; }
    public string BinhLuan { get; set; }
    public DateTime NgayTao { get; set; }
}