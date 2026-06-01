using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;

namespace VietJob_DATN.Employers
{
    public class Employer : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Logo { get; set; }
        public string Website { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        // Có thể liên kết với UserId nếu mỗi nhà tuyển dụng là một User
        public long? UserId { get; set; }
        public string ContactEmail { get; set; }
    }
}
