using Abp.Domain.Entities;

public class TinTuyenDung : Entity<int>
{
    public int NhaTuyenDungId { get; set; }
    public string TieuDe { get; set; }
    public string MoTa { get; set; }
    public string YeuCau { get; set; }
    public decimal LuongMin { get; set; }
    public decimal LuongMax { get; set; }
    public int DanhMucId { get; set; }
    public int DiaDiemId { get; set; }
    public string TrangThai { get; set; }
}