using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace VietJob_DATN.Employers
{
    public class EmployerDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Logo { get; set; }
        public string Website { get; set; }
        public string ContactEmail { get; set; }
        // Thêm các trường cần hiển thị
    }
}
