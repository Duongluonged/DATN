using Abp.Domain.Entities;

public class UngVien : Entity<int>
{
    public int NguoiDungId { get; set; }
    public string Ho { get; set; }
    public string Ten { get; set; }
    public string SoDienThoai { get; set; }
    public string DiaChi { get; set; }
    public string Avatar { get; set; }
    public int SoNamKinhNghiem { get; set; }
}