using Abp.Domain.Entities;

public class ViTien : Entity<int>
{
    public int NhaTuyenDungId { get; set; }
    public decimal SoDu { get; set; }
}