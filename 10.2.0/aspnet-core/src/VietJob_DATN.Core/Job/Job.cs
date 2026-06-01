using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using VietJob_DATN.Employers; // Nhớ using đúng namespace của Employer

namespace VietJob_DATN.Jobs
{
    public class Job : FullAuditedEntity<Guid>
    {
        public string Title { get; set; }         // Tiêu đề công việc
        public string Description { get; set; }   // Mô tả chi tiết
        public string Location { get; set; }      // Địa điểm làm việc
        public decimal? MinSalary { get; set; }   // Lương tối thiểu
        public decimal? MaxSalary { get; set; }   // Lương tối đa
        public DateTime ExpirationDate { get; set; } // Ngày hết hạn tin tuyển dụng

        // Khóa ngoại liên kết với Nhà tuyển dụng
        public Guid EmployerId { get; set; }

        [ForeignKey("EmployerId")]
        public virtual Employer Employer { get; set; }
    }
}