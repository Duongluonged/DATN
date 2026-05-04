using Abp.Domain.Entities;

public class ViecDaLuu : Entity<int>
{
    public int UngVienId { get; set; }
    public int TinTuyenDungId { get; set; }
}