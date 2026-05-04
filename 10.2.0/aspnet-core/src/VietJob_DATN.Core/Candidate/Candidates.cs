using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using VietJob_DATN.Authorization.Users;

namespace VietJob_DATN.Candidates
{
    [Table("AppCandidates")]
    public class Candidate : FullAuditedEntity<long>
    {
        // Liên kết với tài khoản User
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        // Thông tin hồ sơ ứng viên
        [Required]
        [StringLength(256)]
        public string FullName { get; set; }

        public string Title { get; set; } // Ví dụ: Lập trình viên ReactJS

        public string Skills { get; set; } // Kỹ năng

        public string Education { get; set; } // Học vấn

        public string Experience { get; set; } // Kinh nghiệm làm việc

        public string CvPath { get; set; } // Link file CV (Cloudinary)

        public string PhoneNumber { get; set; }
    }
}