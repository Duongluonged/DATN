using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace VietJob_DATN.Courses
{
    [Table("khoa_hoc")] // Ánh xạ đúng tên bảng trong database của bạn
    public class Course : FullAuditedEntity<int>
    {
        public int NhaTuyenDungId { get; set; }

        public string TieuDe { get; set; }

        public string MoTa { get; set; }

        public string TrangThai { get; set; }

        // Trường ngay_tao đã được FullAuditedEntity tự động quản lý qua thuộc tính CreationTime

        public Course()
        {
            // Mặc định ngày tạo là hiện tại
            CreationTime = DateTime.Now;
        }
    }
}