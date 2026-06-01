using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace VietJob.Entities
{
    [Table("Admins")]
    // QUAN TRỌNG: Phải thêm ": Entity<int>" ở đây
    public class Admin : Entity<int>
    {
        /* LƯU Ý: Dương hãy XÓA hoặc COMMENT dòng [Key] public int Id 
           vì lớp Entity<int> đã có sẵn thuộc tính Id rồi. 
           Nếu để cả hai sẽ bị báo lỗi trùng lặp (Member with the same name).
        */

        // Khóa ngoại liên kết với bảng NguoiDung
        public int NguoiDungId { get; set; }

        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; }

        [Required]
        [MaxLength(255)]
        public string HoTen { get; set; }

        [MaxLength(50)]
        public string CapBac { get; set; }

        [MaxLength(100)]
        public string BoPhan { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;
    }
}