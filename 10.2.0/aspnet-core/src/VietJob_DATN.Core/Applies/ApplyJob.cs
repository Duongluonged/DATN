using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using VietJob_DATN.Authorization.Users;
using VietJob_DATN.Jobs;

namespace VietJob_DATN.Applies
{
    public class ApplyJob : FullAuditedEntity<long>
    {
        public Guid JobId { get; set; }
        [ForeignKey("JobId")]
        public virtual Job Job { get; set; }

        public long CandidateId { get; set; } // UserId của người ứng tuyển
        [ForeignKey("CandidateId")]
        public virtual User Candidate { get; set; }

        public string CvUrl { get; set; }        // Link file CV (PDF/Docx)
        public string CoverLetter { get; set; }  // Lời nhắn gửi nhà tuyển dụng
        public ApplyStatus Status { get; set; }   // Trạng thái hồ sơ
    }

    public enum ApplyStatus
    {
        Pending = 0,    // Chờ duyệt
        Reviewed = 1,   // Đã xem hồ sơ
        Interview = 2,  // Hẹn phỏng vấn
        Accepted = 3,   // Nhận việc
        Rejected = 4    // Từ chối
    }
}