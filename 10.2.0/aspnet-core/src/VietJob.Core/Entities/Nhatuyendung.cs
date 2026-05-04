using Abp.Domain.Entities;

public class NhaTuyenDung : Entity<int>
{
    public int NguoiDungId { get; set; }
    public string TenCongTy { get; set; }
    public string Logo { get; set; }
    public string MoTa { get; set; }
    public string Website { get; set; }
    public string DiaChi { get; set; }
}